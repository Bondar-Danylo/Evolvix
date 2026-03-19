import styles from "./Table.module.scss";
import type { IColumn } from "./Table.types";

export interface TableProps<T> {
  data: T[];
  columns: IColumn<T>[];
  focusedIndex?: number;
  onRowMouseEnter?: (index: number) => void;
  onRowClick?: (record: T) => void;
}

export const Table = <T extends { id: string | number }>({
  data,
  columns,
  focusedIndex,
  onRowMouseEnter,
  onRowClick,
}: TableProps<T>) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr
            key={record.id}
            className={focusedIndex === index ? styles.focused : ""}
            onMouseEnter={() => onRowMouseEnter?.(index)}
            // ВЕШАЕМ КЛИК НА СТРОКУ
            onClick={() => onRowClick?.(record)}
            style={{ cursor: "pointer" }}
          >
            {columns.map((col) => {
              const cellValue =
                col.key in record ? record[col.key as keyof T] : undefined;

              return (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(cellValue, record)
                    : (cellValue as React.ReactNode)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
