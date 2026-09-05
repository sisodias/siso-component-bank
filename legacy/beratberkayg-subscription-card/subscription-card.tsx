"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

export function SubscriptionCard() {
  const data = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 85 },
    { month: "Mar", value: 55 },
    { month: "Apr", value: 75 },
    { month: "May", value: 50 },
    { month: "Jun", value: 65 },
    { month: "Jul", value: 85 },
    { month: "Aug", value: 55 },
  ];

  const color = "hsl(var(--foreground))";

  return (
    <Card className= "w-full md:max-w-md" >
    <CardHeader className="pb-2" >
      <CardTitle className="text-base font-medium" > Subscriptions < /CardTitle>
        < /CardHeader>
        < CardContent className = "space-y-4" >
          <div>
          <h3 className="text-2xl font-bold" > +2350 < /h3>
            < p className = "text-sm text-muted-foreground" >
              +80.1 % from last month
                < /p>
                < /div>

                < div className = " h-32 w-full" >
                  <ResponsiveContainer width="100%" height = "100%" >
                    <BarChart data={ data }>
                      <XAxis
                dataKey="month"
  axisLine = { false}
  tickLine = { false}
  tick = {{ fontSize: 12, fill: "#666" }
}
/>

  < Bar
dataKey = "value"
fill = { color }
radius = { [2, 2, 0, 0]}
isAnimationActive = { true}
  />
  </BarChart>
  < /ResponsiveContainer>
  < /div>
  < /CardContent>
  < /Card>
  );
}