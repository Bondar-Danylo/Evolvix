import type { IProgressCircleProps } from "./ProgressCircle.types";
import styles from "./ProgressCircle.module.scss";

const ProgressCircle = ({
  value,
  size = 32,
  strokeWidth = 3,
}: IProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Фоновое кольцо (серое) */}
        <circle
          className={styles.background}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Кольцо прогресса (синее) */}
        <circle
          className={styles.progress}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" // Скругленные края линии
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Поворот, чтобы начать сверху
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;
