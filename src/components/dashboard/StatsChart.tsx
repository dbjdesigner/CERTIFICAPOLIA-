"use client"

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", published: 45, drafts: 12 },
  { month: "Fev", published: 52, drafts: 15 },
  { month: "Mar", published: 48, drafts: 8 },
  { month: "Abr", published: 61, drafts: 14 },
  { month: "Mai", published: 55, drafts: 10 },
  { month: "Jun", published: 67, drafts: 18 },
]

const chartConfig = {
  published: {
    label: "Publicados",
    color: "hsl(var(--primary))",
  },
  drafts: {
    label: "Rascunhos",
    color: "hsl(var(--accent))",
  },
}

export function StatsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="published" fill="var(--color-published)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="drafts" fill="var(--color-drafts)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}