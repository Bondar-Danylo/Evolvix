import Search from "@/components/Search/Search";
import styles from "./EmployeeList.module.scss";
import Dropdown from "@/components/Dropdown/Dropdown";

const EmployeeListPage = () => {
  const options: string[] = ["Manager", "Porter", "Cleaner", "Supervisor"];
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Search />
        <Dropdown options={options} editable />
      </div>
    </div>
  );
};

export default EmployeeListPage;
