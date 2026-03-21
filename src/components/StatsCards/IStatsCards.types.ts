export interface IStatsCards {
    image: string,
    description: string,
    text: string,
    number: string | number,
    color: 'blue' | 'yellow' | 'red' | 'green',
}

export interface IStatsProps {
  stats: {
    total: number;
    onboarding: number;
    rate: string;
    overdue: number;
  };
}