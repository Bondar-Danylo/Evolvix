import { useState, useMemo } from "react";

export const useTableSearch = <T,>(data: T[], searchFields: (keyof T)[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return value ? String(value).toLowerCase().includes(lowerQuery) : false;
      })
    );
  }, [data, searchQuery, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  };
};