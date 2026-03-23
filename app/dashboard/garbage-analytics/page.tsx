"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ZoneTrendItem {
    time: string;
    SonTra: number;
    ThanhKhe: number;
    LienChieu: number;
    HaiChau: number;
    CamLe: number;
    NguHanhSon: number;
    HoaVang: number;
}

interface MonthlyZoneData {
    month: string;
    SonTra: number;
    ThanhKhe: number;
    LienChieu: number;
    HaiChau: number;
    CamLe: number;
    NguHanhSon: number;
    HoaVang: number;
}

const zoneTrendData: ZoneTrendItem[] = [
    { time: "08:00", SonTra: 12, ThanhKhe: 18, LienChieu: 9, HaiChau: 14, CamLe: 10, NguHanhSon: 7, HoaVang: 6 },
    { time: "10:00", SonTra: 16, ThanhKhe: 22, LienChieu: 12, HaiChau: 17, CamLe: 13, NguHanhSon: 9, HoaVang: 8 },
    { time: "12:00", SonTra: 20, ThanhKhe: 25, LienChieu: 14, HaiChau: 20, CamLe: 15, NguHanhSon: 11, HoaVang: 9 },
    { time: "14:00", SonTra: 18, ThanhKhe: 24, LienChieu: 13, HaiChau: 21, CamLe: 14, NguHanhSon: 12, HoaVang: 10 },
    { time: "16:00", SonTra: 24, ThanhKhe: 28, LienChieu: 19, HaiChau: 24, CamLe: 16, NguHanhSon: 14, HoaVang: 12 },
    { time: "18:00", SonTra: 28, ThanhKhe: 32, LienChieu: 22, HaiChau: 27, CamLe: 18, NguHanhSon: 15, HoaVang: 14 },
];

const monthlyZoneData: MonthlyZoneData[] = [
    {
        month: "2026-01",
        SonTra: 330,
        ThanhKhe: 420,
        LienChieu: 230,
        HaiChau: 480,
        CamLe: 250,
        NguHanhSon: 170,
        HoaVang: 130,
    },
    {
        month: "2026-02",
        SonTra: 300,
        ThanhKhe: 390,
        LienChieu: 210,
        HaiChau: 460,
        CamLe: 230,
        NguHanhSon: 160,
        HoaVang: 120,
    },
    {
        month: "2026-03",
        SonTra: 360,
        ThanhKhe: 430,
        LienChieu: 250,
        HaiChau: 500,
        CamLe: 270,
        NguHanhSon: 180,
        HoaVang: 140,
    },
];

const imageDatabaseMock = [
    {
        id: 1,
        area: "Sơn Trà",
        recordedAt: "2026-03-20 07:30",
        imageUrl: "https://images.unsplash.com/photo-1600180758896-80c8a22f30b5?auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 2,
        area: "Thanh Khê",
        recordedAt: "2026-03-20 12:45",
        imageUrl: "https://images.unsplash.com/photo-1598511722960-1d6fd0a20afb?auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 3,
        area: "Liên Chiểu",
        recordedAt: "2026-03-20 17:15",
        imageUrl: "https://images.unsplash.com/photo-1603808033195-97f8061cd41d?auto=format&fit=crop&w=800&q=60",
    },
];

const zones = ["Tất cả", "Sơn Trà", "Thanh Khê", "Liên Chiểu", "Hải Châu", "Cẩm Lệ", "Ngũ Hành Sơn", "Hòa Vang"];

const zoneColors: Record<string, string> = {
    "Sơn Trà": "#0ea5e9",
    "Thanh Khê": "#22c55e",
    "Liên Chiểu": "#f59e0b",
    "Hải Châu": "#ef4444",
    "Cẩm Lệ": "#a855f7",
    "Ngũ Hành Sơn": "#fb923c",
    "Hòa Vang": "#14b8a6",
    "Tất cả": "#3b82f6",
};

export default function GarbageAnalyticsPage() {
    const [selectedMonth, setSelectedMonth] = useState(monthlyZoneData[0].month);
    const [selectedZone, setSelectedZone] = useState<"Tất cả" | "Sơn Trà" | "Thanh Khê" | "Liên Chiểu" | "Hải Châu" | "Cẩm Lệ" | "Ngũ Hành Sơn" | "Hòa Vang">("Tất cả");

    const totalWaste = useMemo(
        () => monthlyZoneData.reduce(
            (sum, row) =>
                sum + row.SonTra + row.ThanhKhe + row.LienChieu + row.HaiChau + row.CamLe + row.NguHanhSon + row.HoaVang,
            0
        ),
        []
    );

    const zoneSummary = useMemo(() => {
        const result = {
            SonTra: 0,
            ThanhKhe: 0,
            LienChieu: 0,
            HaiChau: 0,
            CamLe: 0,
            NguHanhSon: 0,
            HoaVang: 0,
        };
        monthlyZoneData.forEach((row) => {
            result.SonTra += row.SonTra;
            result.ThanhKhe += row.ThanhKhe;
            result.LienChieu += row.LienChieu;
            result.HaiChau += row.HaiChau;
            result.CamLe += row.CamLe;
            result.NguHanhSon += row.NguHanhSon;
            result.HoaVang += row.HoaVang;
        });
        return result;
    }, []);

    const busiestZone = useMemo(() => {
        const zoneValues = [
            { name: "Sơn Trà", value: zoneSummary.SonTra },
            { name: "Thanh Khê", value: zoneSummary.ThanhKhe },
            { name: "Liên Chiểu", value: zoneSummary.LienChieu },
            { name: "Hải Châu", value: zoneSummary.HaiChau },
            { name: "Cẩm Lệ", value: zoneSummary.CamLe },
            { name: "Ngũ Hành Sơn", value: zoneSummary.NguHanhSon },
            { name: "Hòa Vang", value: zoneSummary.HoaVang },
        ];
        return zoneValues.sort((a, b) => b.value - a.value)[0];
    }, [zoneSummary]);

    const monthlyData = useMemo(() => monthlyZoneData.find((row) => row.month === selectedMonth) ?? monthlyZoneData[0], [selectedMonth]);

    const chartData = useMemo(() => {
        if (selectedZone === "Tất cả") {
            return [
                { zone: "Sơn Trà", value: monthlyData.SonTra },
                { zone: "Thanh Khê", value: monthlyData.ThanhKhe },
                { zone: "Liên Chiểu", value: monthlyData.LienChieu },
                { zone: "Hải Châu", value: monthlyData.HaiChau },
                { zone: "Cẩm Lệ", value: monthlyData.CamLe },
                { zone: "Ngũ Hành Sơn", value: monthlyData.NguHanhSon },
                { zone: "Hòa Vang", value: monthlyData.HoaVang },
            ];
        }

        const value =
            selectedZone === "Sơn Trà"
                ? monthlyData.SonTra
                : selectedZone === "Thanh Khê"
                    ? monthlyData.ThanhKhe
                    : selectedZone === "Liên Chiểu"
                        ? monthlyData.LienChieu
                        : selectedZone === "Hải Châu"
                            ? monthlyData.HaiChau
                            : selectedZone === "Cẩm Lệ"
                                ? monthlyData.CamLe
                                : selectedZone === "Ngũ Hành Sơn"
                                    ? monthlyData.NguHanhSon
                                    : monthlyData.HoaVang;

        return [{ zone: selectedZone, value }];
    }, [selectedZone, monthlyData]);

    return (

        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                <div className="p-5 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Waste and Urban Environment Monitoring</h1>
                            <p className="text-sm text-slate-500 mt-1">Da Nang — Data overview across zones and field images</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="rounded-full bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-700">LIVE</span>
                            <span>Updated: {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Waste (kg)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-700">{totalWaste.toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Last 3 months total</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Highest Waste Region</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{busiestZone.name}</p>
                            <p className="text-sm text-slate-500">{busiestZone.value.toLocaleString()} kg / 3 months</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Selected Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{selectedMonth}</p>
                            <p className="text-sm text-slate-500">{selectedZone === "Tất cả" ? "All zones" : selectedZone}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Field Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{imageDatabaseMock.length}</p>
                            <p className="text-sm text-slate-500">Raw data from cameras and citizen reports</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                            <div>
                                <CardTitle>Filter Controls</CardTitle>
                                <p className="text-sm text-slate-500">Select month and zone to view trend</p>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    value={selectedMonth}
                                    onChange={(event) => setSelectedMonth(event.target.value)}
                                >
                                    {monthlyZoneData.map((row) => (
                                        <option key={row.month} value={row.month}>
                                            {row.month}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    value={selectedZone}
                                    onChange={(event) => setSelectedZone(event.target.value as any)}
                                >
                                    {zones.map((zone) => (
                                        <option key={zone} value={zone}>
                                            {zone}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-105">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 16, right: 22, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="zone" stroke="#64748b" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value) => `${value} kg`} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry) => (
                                        <Cell key={entry.zone} fill={zoneColors[entry.zone] ?? "#3b82f6"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Zone Details</CardTitle>
                            <p className="text-sm text-slate-500">Monthly data for each district</p>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr>
                                            <th className="p-3">Month</th>
                                            <th className="p-3">Son Tra</th>
                                            <th className="p-3">Thanh Khe</th>
                                            <th className="p-3">Lien Chieu</th>
                                            <th className="p-3">Hai Chau</th>
                                            <th className="p-3">Cam Le</th>
                                            <th className="p-3">Ngu Hanh Son</th>
                                            <th className="p-3">Hoa Vang</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyZoneData.map((entry) => (
                                            <tr key={entry.month} className="border-b even:bg-slate-50">
                                                <td className="p-3 font-medium">{entry.month}</td>
                                                <td className="p-3">{entry.SonTra.toLocaleString()}</td>
                                                <td className="p-3">{entry.ThanhKhe.toLocaleString()}</td>
                                                <td className="p-3">{entry.LienChieu.toLocaleString()}</td>
                                                <td className="p-3">{entry.HaiChau.toLocaleString()}</td>
                                                <td className="p-3">{entry.CamLe.toLocaleString()}</td>
                                                <td className="p-3">{entry.NguHanhSon.toLocaleString()}</td>
                                                <td className="p-3">{entry.HoaVang.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Field Monitoring Images</CardTitle>
                            <p className="text-sm text-slate-500">Images showing real conditions and pollution levels</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {imageDatabaseMock.map((item) => (
                                    <div key={item.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
                                        <img className="h-44 w-full object-cover rounded-t-lg" src={item.imageUrl} alt={`${item.area} - ${item.recordedAt}`} />
                                        <div className="space-y-1 p-3">
                                            <p className="text-sm font-semibold">{item.area}</p>
                                            <p className="text-xs text-slate-500">{item.recordedAt}</p>
                                            <p className="text-xs text-slate-500">Source: surveillance camera / citizen report</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
