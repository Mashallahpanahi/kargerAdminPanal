"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cell, Pie, PieChart } from "recharts";

type UserDistributionChartProps = {
  employers: number;
  employees: number;
};

const chartConfig = {
  employers: {
    label: "Employers",
    color: "var(--chart-1)",
  },
  employees: {
    label: "Employees",
    color: "var(--chart-2)",
  },
};

export function UserDistributionChart({
  employers,
  employees,
}: UserDistributionChartProps) {
  const data = [
    { name: "employers", value: employers, fill: "var(--color-employers)" },
    { name: "employees", value: employees, fill: "var(--color-employees)" },
  ].filter((item) => item.value > 0);

  const total = employers + employees;

  return (
    <Card className="h-full rounded-sm shadow-none">
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>
          Breakdown of registered employers and employees
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
            No user data available yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto h-[220px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
        <div className="mt-2 grid grid-cols-2 gap-3 text-center text-sm">
          <div className="rounded-sm bg-blue-50 px-3 py-2 dark:bg-blue-950/30">
            <p className="text-muted-foreground">Employers</p>
            <p className="text-lg font-semibold tabular-nums">{employers}</p>
          </div>
          <div className="rounded-sm bg-emerald-50 px-3 py-2 dark:bg-emerald-950/30">
            <p className="text-muted-foreground">Employees</p>
            <p className="text-lg font-semibold tabular-nums">{employees}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
