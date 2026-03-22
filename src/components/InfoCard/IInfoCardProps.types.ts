export interface IInfoCardData {
    id: number,
    title: string,
}
export interface InfoItem {
    id: string | number;
    title: string;
    type?: "user" | "training" | "topic";
    target_id?: number | string;
}

export interface IInfoCardProps {
    data: InfoItem[];
    children: React.ReactNode; 
    onItemClick?: (item: InfoItem) => void;
}