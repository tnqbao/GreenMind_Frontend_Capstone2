"use client"

import type { PollutionData } from "@/types/environmental"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface Props {
  pollutionData: PollutionData
  selectedPollutants: string[]
}

const LABEL_MAP: Record<string, string> = {
  co2_emission: "CO₂",
  methane_emission: "CH₄",
  nitrous_oxide: "N₂O",
  particulate_matter: "PM",
  sulfur_dioxide: "SO₂",
  nitrogen_dioxide: "NO₂",
  carbon_monoxide: "CO",
  volatile_organic: "VOC",
  ammonia: "NH₃",
  lead_emission: "Pb",
  mercury_emission: "Hg",
  cadmium_emission: "Cd",
  benzene_emission: "C₆H₆",
  ozone_depletion: "ODP",
  radioactive_waste: "RAD",
  total_pollution: "Total",
}

const BAR_COLORS: Record<string, string> = {
  total_pollution: "#10b981",
}

const DEFAULT_COLOR = "#6366f1"

function buildChartData(pollutionData: PollutionData, selectedPollutants: string[]) {
  const entries = Object.entries(pollutionData)
  const filtered = selectedPollutants.length > 0
    ? entries.filter(([key]) => selectedPollutants.includes(key))
    : entries

  const total = filtered.reduce((acc, [, val]) => acc + val, 0)

  const bars = filtered.map(([key, value]) => ({
    key,
    label: LABEL_MAP[key] ?? key,
    value,
  }))

  bars.push({ key: "total_pollution", label: "Total", value: total })
  return bars
}

export function PollutionBarChart({ pollutionData, selectedPollutants }: Props) {
  const data = buildChartData(pollutionData, selectedPollutants)

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            label={{ value: "Value", angle: -90, position: "insideLeft", fill: "#6b7280", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
            labelStyle={{ color: "var(--foreground)" }}
            itemStyle={{ color: "var(--muted-foreground)" }}
            formatter={(val) => [val, "Value"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={BAR_COLORS[entry.key] ?? DEFAULT_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
