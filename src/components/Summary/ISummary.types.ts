export interface ISummary {
    title: string,
    subtitle: string
}

export interface ISummaryProps {
  data: {
    successRate: string;
    trainingsCount: number;
    mostActiveDept: string;
    topicsCount: number;
    targetPercent: number;
    acceleration: string;
  } | null;
}