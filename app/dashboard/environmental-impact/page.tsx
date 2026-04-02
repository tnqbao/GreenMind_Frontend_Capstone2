"use client"

import { useState, useMemo } from "react"
import type { TimeRange } from "@/types/environmental"
import { generateMockData } from "@/services/environmental.service"
import { StatsPanel } from "@/components/environmental-impact/StatsPanel"
import { DashboardFilters } from "@/components/environmental-impact/DashboardFilters"
import { PollutionBarChart } from "@/components/environmental-impact/PollutionBarChart"
import { ImpactAreaChart } from "@/components/environmental-impact/ImpactAreaChart"

export default function EnvironmentalImpactPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month")
  const [selectedPollutants, setSelectedPollutants] = useState<string[]>([])

  const data = useMemo(() => generateMockData(timeRange), [timeRange])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-1">Environmental Impact</h1>
        <p className="text-muted-foreground text-sm">Tác động tới môi trường</p>
      </div>

      {/* Stats */}
      <StatsPanel pollution={data.pollution} impact={data.impact} />

      {/* Filters */}
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <DashboardFilters
          timeRange={timeRange}
          selectedPollutants={selectedPollutants}
          onTimeRangeChange={setTimeRange}
          onPollutantsChange={setSelectedPollutants}
        />
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground tracking-wide uppercase">
            Pollution Breakdown
          </h2>
          <PollutionBarChart
            pollutionData={data.pollution}
            selectedPollutants={selectedPollutants}
          />
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground tracking-wide uppercase">
            Impact Over Time
          </h2>
          <ImpactAreaChart timeSeries={data.timeSeries} />
        </section>
      </div>
    </div>
  )
}
