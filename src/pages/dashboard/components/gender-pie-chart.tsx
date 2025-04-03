"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"


export const description = "A donut chart with text"

const chartConfig = {
  employees: {
    label: "Employees",
  },
  male: {
    label: "Male",
    color: "#1f77b4", // Updated to hash code
  },
  female: {
    label: "Female",
    color: "#ff7f0e", // Updated to hash code
  },
  other: {
    label: "Other",
    color: "#2ca02c", // Updated to hash code
  },
} satisfies ChartConfig

export function GenderPieChart({ genderWiseEmployees }: { genderWiseEmployees: any }) {
  const chartData = React.useMemo(() => {
    if (!genderWiseEmployees) return [];
    return [
      { gender: "male", employees: genderWiseEmployees.male_employees || 0, fill: "#1f77b4" }, // Updated to hash code
      { gender: "female", employees: genderWiseEmployees.female_employees || 0, fill: "#ff7f0e" }, // Updated to hash code
      { gender: "other", employees: genderWiseEmployees.other_employees || 0, fill: "#2ca02c" }, // Updated to hash code
    ];
  }, [genderWiseEmployees]);

  const totalEmployees = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.employees, 0)
  }, [chartData])

  return (
    <>
      <CardHeader className="items-center pb-0">
        <CardTitle>Gender Wise Employees</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0 ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="employees"
              nameKey="gender"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEmployees.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Employees
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Showing total employees  <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
         
        </div>
      </CardFooter>
    </>
  )
}
