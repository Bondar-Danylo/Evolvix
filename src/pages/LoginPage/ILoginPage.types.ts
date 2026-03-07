export interface ILoginPage {
    email: string;
    password: string;
}

export interface ILoginPageProps {
    role: 'admin' | 'user';
    setRole: (role: 'admin' | 'user') => void;
}