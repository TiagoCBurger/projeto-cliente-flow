
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChartBar } from "lucide-react";

const ProjectProgress = () => {
  // Dados de exemplo para o gráfico
  const progressData = [
    { name: "Planejamento", concluído: 100, total: 100 },
    { name: "Design", concluído: 80, total: 100 },
    { name: "Desenvolvimento", concluído: 45, total: 100 },
    { name: "Testes", concluído: 20, total: 100 },
    { name: "Lançamento", concluído: 0, total: 100 },
  ];

  // Dados formatados para o gráfico de pizza
  const pieData = progressData.map(item => ({
    name: item.name,
    value: item.concluído,
  }));

  // Cores personalizadas para os segmentos do gráfico
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Calcular o progresso geral do projeto com base nos dados
  const calculateOverallProgress = () => {
    const totalCompleted = progressData.reduce((acc, item) => acc + item.concluído, 0);
    const totalPossible = progressData.reduce((acc, item) => acc + item.total, 0);
    return Math.round((totalCompleted / totalPossible) * 100);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Progresso Geral</p>
              <p className="text-sm font-medium">{overallProgress}%</p>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Gráfico de área mostrando o progresso */}
            <div className="h-64">
              <p className="text-sm font-medium mb-2 text-center">Progresso por Etapa</p>
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
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="concluído" 
                    name="progresso" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
            
            {/* Gráfico de pizza mostrando a distribuição */}
            <div className="h-64">
              <p className="text-sm font-medium mb-2 text-center">Distribuição do Progresso</p>
              <ChartContainer 
                config={{
                  Planejamento: {
                    label: "Planejamento",
                    color: COLORS[0],
                  },
                  Design: {
                    label: "Design",
                    color: COLORS[1],
                  },
                  Desenvolvimento: {
                    label: "Desenvolvimento",
                    color: COLORS[2],
                  },
                  Testes: {
                    label: "Testes",
                    color: COLORS[3],
                  },
                  Lançamento: {
                    label: "Lançamento",
                    color: COLORS[4],
                  }
                }}
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectProgress;
