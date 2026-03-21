import { ResponsiveContainer } from "recharts";
import styles from "./ChartCard.module.scss";
import type { IExtendedChartProps } from "./IChartCard.types";
import ChartLine from "../ChartLine/ChartLine";
import ChartPie from "../ChartPie/ChartPie";

const ChartCard = ({
  data,
  type,
  children,
  onPeriodChange,
  currentPeriod,
}: IExtendedChartProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onPeriodChange) {
      onPeriodChange(Number(e.target.value));
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <h2 className={styles.card__title}>{children}</h2>
        <select
          className={styles.card__select}
          onChange={handleChange}
          value={currentPeriod}
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
        </select>
      </div>

      <div className={styles.card__body}>
        <ResponsiveContainer width="100%" height={220}>
          {type === "line" ? (
            <ChartLine data={data as any} />
          ) : (
            <ChartPie data={data as any} />
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
