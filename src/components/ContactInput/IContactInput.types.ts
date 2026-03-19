export interface  IContactInputProps {
    type: 'text' | 'email' | 'phone' | 'password',
    icon: string,
    value: string,
    onChange: (newValue: string) => void;
    onBlur?: () => void;
}