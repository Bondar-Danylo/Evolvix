import type { IProgressCircleProps } from "./ProgressCircle.types";
import styles from "./ProgressCircle.module.scss";

const ProgressCircle = ({
  value,
  size = 32,
  strokeWidth = 3,
}: IProgressCircleProps) => {
  const radius: number = (size - strokeWidth) / 2;
  const circumference: number = radius * 2 * Math.PI;
  const offset: number = circumference - (value / 100) * circumference;
  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className={styles.background}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.progress}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;
