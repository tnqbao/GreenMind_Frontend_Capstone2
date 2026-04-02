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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold leading-none">Environmental Impact</h1>
            <p className="mt-0.5 text-xs text-gray-500">Tác động tới môi trường</p>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Stats */}
        <StatsPanel pollution={data.pollution} impact={data.impact} />

        {/* Filters */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <DashboardFilters
            timeRange={timeRange}
            selectedPollutants={selectedPollutants}
            onTimeRangeChange={setTimeRange}
            onPollutantsChange={setSelectedPollutants}
          />
        </section>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Bar chart */}
          <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-300 tracking-wide uppercase">
              Pollution Breakdown
            </h2>
            <PollutionBarChart
              pollutionData={data.pollution}
              selectedPollutants={selectedPollutants}
            />
          </section>

          {/* Area chart */}
          <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-300 tracking-wide uppercase">
              Impact Over Time
            </h2>
            <ImpactAreaChart timeSeries={data.timeSeries} />
          </section>
        </div>
      </main>
    </div>
  )
}
