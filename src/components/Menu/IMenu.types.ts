import type { FC, SVGProps } from "react";
import type { IRole } from "./IRole.types";

export interface IMenu {
    image: FC<SVGProps<SVGSVGElement>>,
    text: string,
    path: string
}

export interface IMenuProps {
    role: IRole['role'],
    onClickHandler: (e: React.MouseEvent<HTMLElement>) => void;
}