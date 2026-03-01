import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { IChartProps } from "../ChartCard/IChartCard.types";

const ChartLine = ({ data }: IChartProps) => {
  if (!data || data.length === 0) return null;

  const keys: string[] = Object.keys(data[0]);
  const xKey: string = keys[0];
  const yKey: string = keys[1];

  return (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey={xKey} />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Line type="monotone" dataKey={yKey} stroke="#001067" strokeWidth={2} />
    </LineChart>
  );
};

export default ChartLine;
