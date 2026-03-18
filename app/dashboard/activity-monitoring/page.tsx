"use client"

import React, { useEffect, useMemo, useState } from "react";
import { activityService, Area as AreaType, WasteReport } from "@/services/activity.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const headerSelectClass = "border border-gray-300 bg-white rounded px-3 py-2 text-sm text-gray-700";

export default function DashboardActivityMonitoringPage() {
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [overview, setOverview] = useState<any | null>(null);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);

  // UI controls
  const [dateRange, setDateRange] = useState("7d");
  const [filterArea, setFilterArea] = useState("all");

  // selected area for detail (default to third area if exists)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  // heatmap tooltip
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([activityService.getAreas(), activityService.getOverview(), activityService.getWasteReports()])
      .then(([areasRes, overviewRes, reportsRes]) => {
        if (!mounted) return;
        setAreas(areasRes);
        setOverview(overviewRes);
        setReports(Array.isArray(reportsRes) ? reportsRes : []);
        // default select area to third or first
        setSelectedAreaId((areasRes && areasRes[2]?.id) || (areasRes && areasRes[0]?.id) || null);
      })
      .catch((e) => console.error(e))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // design-provided datasets (smooth trends)
  const wasteLast7 = useMemo(
    () => [
      { day: "Mon", value: 1200 },
      { day: "Tue", value: 1350 },
      { day: "Wed", value: 1100 },
      { day: "Thu", value: 1500 },
      { day: "Fri", value: 1700 },
      { day: "Sat", value: 2000 },
      { day: "Sun", value: 1850 },
    ],
    []
  );

  const plasticMonthly = useMemo(
    () => [
      { month: "Jan", value: 32 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 38 },
      { month: "Apr", value: 36 },
      { month: "May", value: 40 },
    ],
    []
  );

  // heatmap simplified blocks — derive from areas' total_waste
  const heatmapBlocks = useMemo(() => {
    // Use first 4 areas or repeat values to fill 4 blocks
    const data = (areas.length ? areas.slice(0, 4) : [
      { id: "a1", name: "Area A", total_waste: 320, plastic_percentage: 30 },
      { id: "a2", name: "Area B", total_waste: 870, plastic_percentage: 36 },
      { id: "a3", name: "Area C", total_waste: 1540, plastic_percentage: 42 },
      { id: "a4", name: "Area D", total_waste: 640, plastic_percentage: 33 },
    ]) as any[];

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      waste: d.total_waste,
      plastic: d.plastic_percentage,
      // determine risk color via thresholds
      risk: d.total_waste > 5000 ? "HIGH" : d.total_waste > 2000 ? "MEDIUM" : "LOW",
    }));
  }, [areas]);

  const colorForRisk = (risk: string) => {
    if (risk === "HIGH") return "bg-red-100 text-red-700";
    if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const selectedArea = areas.find((a) => a.id === selectedAreaId) || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">Activity Monitoring</h1>
            <p className="text-sm text-[#6B7280] mt-1">Monitor environmental data and urban waste trends</p>
          </div>

          <div className="flex items-center gap-3">
            <select className={headerSelectClass} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <select className={headerSelectClass} value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
              <option value="all">All Areas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Section (4 equal columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {loading || !overview ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          ) : (
            <>
              <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5">
                <div className="text-sm text-[#6B7280]">Total Waste</div>
                <div className="text-2xl font-bold text-[#111827] mt-2">{overview.totalWaste.toLocaleString()} kg</div>
                <div className="text-sm text-[#10B981] mt-1">+8.2% vs last week</div>
              </div>

              <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5">
                <div className="text-sm text-[#6B7280]">Plastic Waste Ratio</div>
                <div className="text-2xl font-bold text-[#111827] mt-2">{overview.avgPlastic}%</div>
                <div className="text-sm text-[#EF4444] mt-1">-2.1% vs last week</div>
              </div>

              <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5">
                <div className="text-sm text-[#6B7280]">Active Households</div>
                <div className="text-2xl font-bold text-[#111827] mt-2">{overview.totalHouseholds}</div>
                <div className="text-sm text-[#6B7280] mt-1">Current active reporters</div>
              </div>

              <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5">
                <div className="text-sm text-[#6B7280]">Pending Reports</div>
                <div className="text-2xl font-bold text-[#111827] mt-2">{reports.filter((r) => r.status === "pending").length}</div>
                <div className="text-sm text-[#6B7280] mt-1">Needs action</div>
              </div>
            </>
          )}
        </div>

        {/* Main 12-column grid: left 8, right 4 */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: 8 columns */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* A. Heatmap Top Card */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-[#111827]">Urban Waste Distribution</h3>
                  <p className="text-xs text-[#6B7280]">Waste amount by neighborhood</p>
                </div>
                <div className="text-sm text-[#6B7280]">Legend: green = low • yellow = medium • red = high</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {heatmapBlocks.map((b, idx) => (
                  <div
                    key={b.id}
                    className={`h-32 rounded-lg border border-[#E5E7EB] p-3 flex flex-col justify-center ${b.risk === 'HIGH' ? 'bg-red-50' : b.risk === 'MEDIUM' ? 'bg-yellow-50' : 'bg-green-50'}`}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ x: rect.x + rect.width / 2, y: rect.y, content: `${b.name} • ${b.waste} kg • ${b.plastic}% plastic` });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setSelectedAreaId(b.id)}
                  >
                    <div className="text-sm text-[#6B7280]">{b.name}</div>
                    <div className="text-lg font-bold text-[#111827] mt-2">{b.waste.toLocaleString()} kg</div>
                    <div className="text-xs text-[#6B7280] mt-1">Plastic {b.plastic}%</div>
                  </div>
                ))}
              </div>

              {tooltip && (
                <div style={{ position: 'absolute', transform: 'translate(-50%, -8px)' , left: tooltip.x, top: tooltip.y }} className="bg-white border border-[#E5E7EB] rounded px-3 py-1 text-xs text-[#111827] shadow">
                  {tooltip.content}
                </div>
              )}
            </div>

            {/* B. Waste Trend Line Chart */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-medium text-[#111827] mb-3">Waste Generation (Last 7 Days)</h3>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={wasteLast7}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* C. Plastic Consumption Bar Chart */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-medium text-[#111827] mb-3">Plastic Usage (Monthly)</h3>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={plasticMonthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT: 4 columns */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* A. Area Detail Card */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-medium text-[#111827]">Area Details</h3>
              <div className="mt-3 bg-[#FEFCE8] p-4 rounded">
                <div className="text-xs text-[#6B7280]">Selected Area</div>
                <div className="text-lg font-bold text-[#111827] mt-1">Thanh Khe District</div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-[#6B7280]">
                  <div>Total Waste</div>
                  <div className="font-medium text-[#111827]">{selectedArea ? selectedArea.total_waste.toLocaleString() + ' kg' : '—'}</div>
                  <div>Households</div>
                  <div className="font-medium text-[#111827]">{selectedArea ? selectedArea.total_households : '—'}</div>
                  <div>Plastic Ratio</div>
                  <div className="font-medium text-[#111827]">{selectedArea ? selectedArea.plastic_percentage + '%' : '—'}</div>
                  <div>Recycling Rate</div>
                  <div className="font-medium text-[#111827]">18%</div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-[#6B7280]">Mini Trend (7 days)</div>
                  <div style={{ width: '100%', height: 80 }} className="mt-2">
                    <ResponsiveContainer>
                      <LineChart data={wasteLast7}>
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                        <Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-3 text-sm text-[#111827]">
                  <div className="bg-yellow-50 border border-[#FDE68A] p-3 rounded text-[#92400E]">
                    Plastic waste increased by 12% this week. Recycling rate is below average.
                  </div>
                </div>
              </div>
            </div>

            {/* B. Reports List */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-medium text-[#111827]">Recent Reports</h3>
              <div className="mt-4 space-y-3">
                {reports.slice(0, 5).map((r) => (
                  <div key={r.id} className="py-3 border-b last:border-b-0">
                    <div className="text-sm font-medium text-[#111827]">{r.description}</div>
                    <div className="text-xs text-[#6B7280]">{r.area.name}</div>
                    <div className="text-xs mt-1">
                      <span className={`${r.status === 'pending' ? 'text-[#EF4444]' : r.status === 'assigned' ? 'text-[#F59E0B]' : 'text-[#10B981]'} font-medium`}>{r.status.toUpperCase()}</span>
                      <span className="text-[#6B7280] ml-2">• {new Date(r.reported_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* C. Collection Tasks */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-medium text-[#111827]">Collection Status</h3>
              <div className="mt-3 divide-y">
                <div className="py-3 flex justify-between">
                  <div className="text-sm text-[#111827]">Area C</div>
                  <div className="text-sm text-[#F59E0B]">In Progress</div>
                </div>
                <div className="py-3 flex justify-between">
                  <div className="text-sm text-[#111827]">Area B</div>
                  <div className="text-sm text-[#10B981]">Completed</div>
                </div>
                <div className="py-3 flex justify-between">
                  <div className="text-sm text-[#111827]">Area D</div>
                  <div className="text-sm text-[#EF4444]">Missed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
