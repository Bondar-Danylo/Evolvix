export interface TimeSeriesData {
  date: string | Date;
  percent: number;
}

export interface DepartmentData {
  department: string;
  percent: number;
}

type AnalyticsData = TimeSeriesData | DepartmentData;

export interface IChartProps {
  data: AnalyticsData[],
  children?: string,
  type?: 'line' | 'pie'
}

export interface IExtendedChartProps extends IChartProps {
  onPeriodChange?: (days: number) => void;
  currentPeriod?: number;
}