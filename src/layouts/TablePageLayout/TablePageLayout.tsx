import { useCallback, useMemo, useState } from "react";
import Search from "@/components/Search/Search";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import { Table } from "@/components/Table/Table";
import { useTableNavigation } from "@/hooks/useTableNavigation";
import { useTableSearch } from "@/hooks/useTableSearch";
import styles from "./TablePageLayout.module.scss";
import type { TablePageLayoutProps } from "./ITablePageLayout.types";

export const TablePageLayout = <
  T extends { id: number | string; name: string },
>({
  data,
  columns,
  searchKeys,
  dropdownOptions,
  addButtonText,
  // onAddClick,
  onRowClick,
}: TablePageLayoutProps<T>) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categoryFilteredData = useMemo(() => {
    if (!selectedCategory) return data;

    return data.filter((item) => {
      return Object.values(item).includes(selectedCategory);
    });
  }, [data, selectedCategory]);

  const { searchQuery, setSearchQuery, filteredData } = useTableSearch<T>(
    categoryFilteredData,
    searchKeys,
  );

  const handleEnter = useCallback(
    (index: number) => {
      if (onRowClick) {
        onRowClick(filteredData[index]);
      } else {
        console.log(`Selecting: ${filteredData[index].name}`);
      }
    },
    [filteredData, onRowClick],
  );

  const { focusedIndex, setFocusedIndex } = useTableNavigation(
    filteredData.length,
    handleEnter,
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Search value={searchQuery} onChange={setSearchQuery} />
        <Dropdown
          options={dropdownOptions}
          editable
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
        <Button type="button" size="medium" color="light">
          {addButtonText}
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <Table
          data={filteredData}
          columns={columns}
          focusedIndex={focusedIndex}
          onRowMouseEnter={setFocusedIndex}
        />
        {filteredData.length === 0 && (
          <p className={styles.error}>No results found</p>
        )}
      </div>
    </div>
  );
};
