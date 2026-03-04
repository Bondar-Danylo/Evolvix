import type { SearchProps } from "./ISearchProps.types";
import styles from "./Search.module.scss";
import SearchIcon from "@/assets/search_icon.svg?react";

const Search = ({ value, onChange }: SearchProps) => {
  return (
    <div className={styles.search}>
      <label htmlFor="search" className={styles.search__label}>
        Search
      </label>
      <input
        type="text"
        id="search"
        className={styles.search__input}
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <SearchIcon className={styles.search__icon} />
    </div>
  );
};

export default Search;
