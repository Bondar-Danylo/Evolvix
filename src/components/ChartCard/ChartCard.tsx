import { ResponsiveContainer } from "recharts";
import styles from "./ChartCard.module.scss";
import type { IChartProps } from "./IChartCard.types";
import ChartLine from "../ChartLine/ChartLine";
import ChartPie from "../ChartPie/ChartPie";

const ChartCard = ({ data, type, children }: IChartProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <h2 className={styles.card__title}>{children}</h2>
        <select className={styles.card__select}>
          <option value="7 days">7 days</option>
          <option value="14 days">14 days</option>
          <option value="30 days">30 days</option>
        </select>
      </div>

      <div className={styles.card__body}>
        <ResponsiveContainer width="100%" height={220}>
          {type === "line" ? (
            <ChartLine data={data} />
          ) : (
            <ChartPie data={data} />
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
