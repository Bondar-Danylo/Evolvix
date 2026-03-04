import styles from "@/components/TableAction/TableActions.module.scss";
import type { TableActionsProps } from "./ITableAction.types";

export const TableActions = ({
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) => (
  <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
    <button onClick={onView} className={styles.actionBtn} title="View">
      👁️
    </button>
    <button onClick={onEdit} className={styles.actionBtn} title="Edit">
      ✏️
    </button>
    <button onClick={onDelete} className={styles.actionBtn} title="Delete">
      🗑️
    </button>
  </div>
);
