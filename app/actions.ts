"use server"

import type { Compound, CalculationResult, ConcentrationUnit } from "../types/chemical"
import { calculateResults } from "../utils/calculations"

export async function calculateCompounds(formData: FormData): Promise<CalculationResult> {
  const compounds: Compound[] = []

  for (let i = 0; i < 10; i++) {
    const name = formData.get(`compound${i}`) as string
    const concentration = Number.parseFloat(formData.get(`concentration${i}`) as string)
    const concentrationUnit = formData.get(`concentrationUnit${i}`) as ConcentrationUnit
    const weight = Number.parseFloat(formData.get(`weight${i}`) as string)
    const molecularWeight = Number.parseFloat(formData.get(`molecularWeight${i}`) as string)

    if (name && !isNaN(concentration) && concentrationUnit && !isNaN(weight)) {
      compounds.push({ name, concentration, concentrationUnit, weight, molecularWeight })
    }
  }

  return calculateResults(compounds)
}

