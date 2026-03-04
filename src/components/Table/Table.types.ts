export interface IColumn<T> {
  header: string;
  key: keyof T | 'actions';
  render?: (value: any, item: T) => React.ReactNode;    
}