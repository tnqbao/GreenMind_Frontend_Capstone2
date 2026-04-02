import type { EnvironmentalPayload, ImpactPoint, TimeRange } from "@/types/environmental"

const BASE_POLLUTION = {
  co2_emission: 420,
  methane_emission: 180,
  nitrous_oxide: 95,
  particulate_matter: 310,
  sulfur_dioxide: 145,
  nitrogen_dioxide: 200,
  carbon_monoxide: 275,
  volatile_organic: 130,
  ammonia: 88,
  lead_emission: 42,
  mercury_emission: 28,
  cadmium_emission: 15,
  benzene_emission: 67,
  ozone_depletion: 190,
  radioactive_waste: 35,
}

const RANGE_DAY_COUNT: Record<TimeRange, number> = {
  day: 1,
  week: 7,
  month: 30,
}

function buildTimeSeries(days: number): ImpactPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const seed = (i + 1) * 7
    return {
      day: i + 1,
      air_pollution: Math.round(200 + (seed % 13) * 15),
      water_pollution: Math.round(150 + (seed % 11) * 12),
      soil_pollution: Math.round(100 + (seed % 9) * 10),
    }
  })
}

export function generateMockData(timeRange: TimeRange): EnvironmentalPayload {
  const dayCount = RANGE_DAY_COUNT[timeRange]
  const timeSeries = buildTimeSeries(dayCount)

  const airTotal = timeSeries.reduce((acc, p) => acc + p.air_pollution, 0)
  const waterTotal = timeSeries.reduce((acc, p) => acc + p.water_pollution, 0)
  const soilTotal = timeSeries.reduce((acc, p) => acc + p.soil_pollution, 0)

  return {
    pollution: { ...BASE_POLLUTION },
    impact: {
      air_pollution: Math.round(airTotal / dayCount),
      water_pollution: Math.round(waterTotal / dayCount),
      soil_pollution: Math.round(soilTotal / dayCount),
    },
    timeSeries,
  }
}
