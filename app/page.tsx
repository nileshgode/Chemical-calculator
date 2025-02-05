"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateCompounds } from "./actions"
import type { CalculationResult, ConcentrationUnit } from "../types/chemical"

const concentrationUnits: ConcentrationUnit[] = ["mol/L", "mmol/L", "g/L", "mg/L", "g/mL", "µg/mL", "mEq/L", "%"]

export default function ChemicalCalculator() {
  const [compoundCount, setCompoundCount] = useState(2)
  const [result, setResult] = useState<CalculationResult | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const calculationResult = await calculateCompounds(formData)
    setResult(calculationResult)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chemical Compound Calculator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Array.from({ length: compoundCount }).map((_, index) => (
          <div key={index} className="grid grid-cols-5 gap-4">
            <div>
              <Label htmlFor={`compound${index}`}>Compound {index + 1}</Label>
              <Input id={`compound${index}`} name={`compound${index}`} required />
            </div>
            <div>
              <Label htmlFor={`concentration${index}`}>Concentration</Label>
              <Input id={`concentration${index}`} name={`concentration${index}`} type="number" step="0.01" required />
            </div>
            <div>
              <Label htmlFor={`concentrationUnit${index}`}>Unit</Label>
              <Select name={`concentrationUnit${index}`} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {concentrationUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`weight${index}`}>Weight (g)</Label>
              <Input id={`weight${index}`} name={`weight${index}`} type="number" step="0.01" required />
            </div>
            <div>
              <Label htmlFor={`molecularWeight${index}`}>Molecular Weight (g/mol)</Label>
              <Input
                id={`molecularWeight${index}`}
                name={`molecularWeight${index}`}
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => setCompoundCount((prev) => Math.min(prev + 1, 10))}
            disabled={compoundCount >= 10}
          >
            Add Compound
          </Button>
          <Button type="submit">Calculate</Button>
        </div>
      </form>
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p>Total Weight: {result.totalWeight.toFixed(2)} g</p>
          <p>
            Total Concentration: {result.totalConcentration.toFixed(4)} {result.totalConcentrationUnit}
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Individual Compounds</h3>
          <ul>
            {result.compounds.map((compound, index) => (
              <li key={index}>
                {compound.name}: Weight - {compound.weight.toFixed(2)} g, Concentration -{" "}
                {compound.concentration.toFixed(4)} {compound.concentrationUnit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

