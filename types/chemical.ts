export type ConcentrationUnit = "mol/L" | "mmol/L" | "g/L" | "mg/L" | "g/mL" | "µg/mL" | "mEq/L" | "%"

export interface Compound {
  name: string
  concentration: number
  concentrationUnit: ConcentrationUnit
  weight: number
  molecularWeight?: number // Needed for molar calculations
}

export interface CalculationResult {
  totalWeight: number
  totalConcentration: number
  totalConcentrationUnit: ConcentrationUnit
  compounds: Compound[]
}

