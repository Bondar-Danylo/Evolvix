import styles from "./Table.module.scss";
import type { IColumn } from "./Table.types";

export interface TableProps<T> {
  data: T[];
  columns: IColumn<T>[];
  focusedIndex?: number;
  onRowMouseEnter?: (index: number) => void;
}

export const Table = <T extends { id: string | number }>({
  data,
  columns,
  focusedIndex,
  onRowMouseEnter,
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
        {data.map((row, index) => (
          <tr
            key={row.id}
            className={index === focusedIndex ? styles.focusedRow : ""}
            onMouseEnter={() => onRowMouseEnter?.(index)}
          >
            {columns.map((col, colIdx) => (
              <td key={colIdx}>
                {col.render
                  ? col.render(row[col.key as keyof T], row)
                  : (row[col.key as keyof T] as any)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
