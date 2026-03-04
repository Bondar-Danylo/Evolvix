import type React from "react";

export interface ButtonProps {
    type: 'reset' | 'button' | 'submit',
    color?: 'blue' | 'light' | 'red',
    size?: 'small' | 'medium' | 'large',
    children: string | React.ReactNode,
    textSize?: 'lower' | 'upper',
}