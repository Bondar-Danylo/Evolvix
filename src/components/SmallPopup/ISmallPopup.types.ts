export interface ISmallPopupProps {
    icon: string,
    title: string,
    subtitle: string,
    text?: string,
    closePopup: () => void,
    onConfirm?: () => void;
}