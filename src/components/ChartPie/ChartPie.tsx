import { Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import type { IChartProps } from "../ChartCard/IChartCard.types";

const ChartPie = ({ data }: IChartProps) => {
  const COLORS: string[] = [
    "#001067",
    "#2ecc71",
    "#f1c40f",
    "#e74c3c",
    "#9b59b6",
    "#34495e",
  ];

  if (!data || data.length === 0) return null;

  const keys: string[] = Object.keys(data[0]);
  const xKey: string = keys[0];
  const yKey: string = keys[1];

  return (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey={yKey}
        nameKey={xKey}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        verticalAlign="bottom"
        height={36}
        formatter={(value, entry: any) => (
          <span style={{ color: entry.color, fontWeight: "bold" }}>
            {value}
          </span>
        )}
      />
    </PieChart>
  );
};

export default ChartPie;
