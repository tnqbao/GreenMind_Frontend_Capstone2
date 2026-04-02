export type TimeRange = "day" | "week" | "month"

export interface PollutionData {
  co2_emission: number
  methane_emission: number
  nitrous_oxide: number
  particulate_matter: number
  sulfur_dioxide: number
  nitrogen_dioxide: number
  carbon_monoxide: number
  volatile_organic: number
  ammonia: number
  lead_emission: number
  mercury_emission: number
  cadmium_emission: number
  benzene_emission: number
  ozone_depletion: number
  radioactive_waste: number
}

export interface ImpactData {
  air_pollution: number
  water_pollution: number
  soil_pollution: number
}

export interface ImpactPoint {
  day: number
  air_pollution: number
  water_pollution: number
  soil_pollution: number
}

export interface EnvironmentalPayload {
  pollution: PollutionData
  impact: ImpactData
  timeSeries: ImpactPoint[]
}
