export interface IInfoCardData {
    id: number,
    title: string,
}

export interface IInfoCardProps {
    children: string,
    data: IInfoCardData[]
}