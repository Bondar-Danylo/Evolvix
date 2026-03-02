import { useState } from "react";
import styles from "./Search.module.scss";
import SearchIcon from "@/assets/search_icon.svg?react";

const Search = () => {
  const [value, setValue] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.search}>
      <label htmlFor="search" className={styles.search__label}>
        Search
      </label>
      <input
        type="text"
        id="search"
        name="search"
        className={styles.search__input}
        placeholder="Search..."
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
      <SearchIcon className={styles.search__icon} aria-hidden="true" />
    </div>
  );
};

export default Search;
