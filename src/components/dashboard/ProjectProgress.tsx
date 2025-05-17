
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";

// Adding specific type imports for Tooltip
type ValueType = string | number | Array<string | number>;
type NameType = string | number;

const ProjectProgress = () => {
  // Dados de exemplo para o gráfico
  const progressData = [
    { name: "Planejamento", concluído: 100, total: 100 },
    { name: "Design", concluído: 80, total: 100 },
    { name: "Desenvolvimento", concluído: 45, total: 100 },
    { name: "Testes", concluído: 20, total: 100 },
    { name: "Lançamento", concluído: 0, total: 100 },
  ];

  // Calcular o progresso geral do projeto com base nos dados
  const calculateOverallProgress = () => {
    const totalCompleted = progressData.reduce((acc, item) => acc + item.concluído, 0);
    const totalPossible = progressData.reduce((acc, item) => acc + item.total, 0);
    return Math.round((totalCompleted / totalPossible) * 100);
  };

  const overallProgress = calculateOverallProgress();

  // Custom tooltip component that satisfies recharts type requirements
  const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
    return <ChartTooltipContent {...props} formatter={(value) => <span>{value}%</span>} />;
  };

  return (
    <div className="space-y-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Progresso Geral</p>
              <p className="text-sm font-medium">{overallProgress}%</p>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="h-64 mt-6">
            <ChartContainer 
              config={{
                progresso: {
                  label: "Progresso",
                  color: "hsl(var(--primary))",
                },
                restante: {
                  label: "Restante",
                  color: "hsl(var(--muted))",
                }
              }}
            >
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="concluído" name="progresso" fill="hsl(var(--primary))" />
                <Bar 
                  dataKey="total" 
                  name="restante" 
                  fill="hsl(var(--muted))"
                  fillOpacity={0.3} 
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectProgress;
