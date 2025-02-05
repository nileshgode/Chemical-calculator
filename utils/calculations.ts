import type { Compound, CalculationResult, ConcentrationUnit } from "../types/chemical"

function convertToBaseUnit(concentration: number, unit: ConcentrationUnit, molecularWeight: number): number {
  switch (unit) {
    case "mol/L":
      return concentration * 1000
    case "mmol/L":
      return concentration
    case "g/L":
      return (concentration * 1000) / molecularWeight
    case "mg/L":
      return concentration / molecularWeight
    case "g/mL":
      return (concentration * 1000000) / molecularWeight
    case "µg/mL":
      return concentration / molecularWeight
    case "mEq/L":
      return concentration // Assuming mEq/L is equivalent to mmol/L for simplicity
    case "%":
      return (concentration * 10000) / molecularWeight
    default:
      return concentration
  }
}

function convertFromBaseUnit(concentration: number, unit: ConcentrationUnit, molecularWeight: number): number {
  switch (unit) {
    case "mol/L":
      return concentration / 1000
    case "mmol/L":
      return concentration
    case "g/L":
      return (concentration * molecularWeight) / 1000
    case "mg/L":
      return concentration * molecularWeight
    case "g/mL":
      return (concentration * molecularWeight) / 1000000
    case "µg/mL":
      return concentration * molecularWeight
    case "mEq/L":
      return concentration // Assuming mEq/L is equivalent to mmol/L for simplicity
    case "%":
      return (concentration * molecularWeight) / 10000
    default:
      return concentration
  }
}

export function calculateResults(compounds: Compound[]): CalculationResult {
  const totalWeight = compounds.reduce((sum, compound) => sum + compound.weight, 0)

  // Convert all concentrations to mmol/L for calculations
  const baseConcentrations = compounds.map((compound) => ({
    ...compound,
    baseConcentration: convertToBaseUnit(
      compound.concentration,
      compound.concentrationUnit,
      compound.molecularWeight || 1,
    ),
  }))

  const totalBaseConcentration =
    baseConcentrations.reduce((sum, compound) => sum + compound.baseConcentration * compound.weight, 0) / totalWeight

  // Choose the most appropriate unit for the total concentration
  let totalConcentrationUnit: ConcentrationUnit = "mmol/L"
  if (totalBaseConcentration >= 1000) totalConcentrationUnit = "mol/L"
  else if (totalBaseConcentration <= 0.001) totalConcentrationUnit = "µg/mL"

  const totalConcentration = convertFromBaseUnit(totalBaseConcentration, totalConcentrationUnit, 1)

  return {
    totalWeight,
    totalConcentration,
    totalConcentrationUnit,
    compounds: baseConcentrations.map((compound) => ({
      ...compound,
      concentration: convertFromBaseUnit(
        (compound.baseConcentration * compound.weight) / totalWeight,
        compound.concentrationUnit,
        compound.molecularWeight || 1,
      ),
    })),
  }
}

