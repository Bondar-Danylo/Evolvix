import type { FC, SVGProps } from "react";

export interface IMenu {
    image: FC<SVGProps<SVGSVGElement>>,
    text: string,
    path: string
}