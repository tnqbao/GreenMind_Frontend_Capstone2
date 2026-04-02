"use client"

import type { TimeRange } from "@/types/environmental"

const TIME_OPTIONS: { label: string; value: TimeRange }[] = [
  { label: "Day",   value: "day"   },
  { label: "Week",  value: "week"  },
  { label: "Month", value: "month" },
]

const ALL_POLLUTANTS = [
  "co2_emission", "methane_emission", "nitrous_oxide", "particulate_matter",
  "sulfur_dioxide", "nitrogen_dioxide", "carbon_monoxide", "volatile_organic",
  "ammonia", "lead_emission", "mercury_emission", "cadmium_emission",
  "benzene_emission", "ozone_depletion", "radioactive_waste",
]

const POLLUTANT_LABELS: Record<string, string> = {
  co2_emission: "CO₂", methane_emission: "CH₄", nitrous_oxide: "N₂O",
  particulate_matter: "PM", sulfur_dioxide: "SO₂", nitrogen_dioxide: "NO₂",
  carbon_monoxide: "CO", volatile_organic: "VOC", ammonia: "NH₃",
  lead_emission: "Pb", mercury_emission: "Hg", cadmium_emission: "Cd",
  benzene_emission: "C₆H₆", ozone_depletion: "ODP", radioactive_waste: "RAD",
}

interface Props {
  timeRange: TimeRange
  selectedPollutants: string[]
  onTimeRangeChange: (range: TimeRange) => void
  onPollutantsChange: (pollutants: string[]) => void
}

function togglePollutant(current: string[], key: string): string[] {
  return current.includes(key)
    ? current.filter((k) => k !== key)
    : [...current, key]
}

export function DashboardFilters({
  timeRange,
  selectedPollutants,
  onTimeRangeChange,
  onPollutantsChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
      {/* Time range */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-widest text-gray-500 uppercase">Time Range</span>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`time-filter-${opt.value}`}
              onClick={() => onTimeRangeChange(opt.value)}
              className={[
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                timeRange === opt.value
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pollutant multi-select */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-widest text-gray-500 uppercase">Pollutants</span>
        <div className="flex flex-wrap gap-2">
          {ALL_POLLUTANTS.map((key) => {
            const isSelected = selectedPollutants.includes(key)
            return (
              <button
                key={key}
                id={`pollutant-filter-${key}`}
                onClick={() => onPollutantsChange(togglePollutant(selectedPollutants, key))}
                className={[
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
                ].join(" ")}
              >
                {POLLUTANT_LABELS[key]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
