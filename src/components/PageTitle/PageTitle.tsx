import type { IPageTitle } from "./IPageTitle.types";
import styles from "./PageTitle.module.scss";

const PageTitle = ({ children }: IPageTitle) => {
  return <h1 className={styles.title}>{children}</h1>;
};

export default PageTitle;
