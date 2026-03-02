import { NavLink } from "react-router-dom";
import styles from "./Menu.module.scss";
import dashboardIcon from "@/assets/dahboard_icon.svg?react";
import listIcon from "@/assets/list_icon.svg?react";
import trainingsIcon from "@/assets/trainings_icon.svg?react";
import topicsIcon from "@/assets/topics_icon.svg?react";
import profileIcon from "@/assets/profile_icon.svg?react";
import type { IMenu } from "./IMenu.types";
import type { IRole } from "./IRole.types";

const Menu = ({ role }: IRole) => {
  const adminMenu: IMenu[] = [
    {
      image: dashboardIcon,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      image: listIcon,
      text: "Employee List",
      path: "/employee-list",
    },
    {
      image: trainingsIcon,
      text: "Trainings",
      path: "/trainings",
    },
    {
      image: topicsIcon,
      text: "Topics",
      path: "/topics",
    },
  ];

  const userMenu: IMenu[] = [
    {
      image: profileIcon,
      text: "Profile",
      path: "/profile",
    },
    {
      image: trainingsIcon,
      text: "Trainings",
      path: "/trainings",
    },
    {
      image: topicsIcon,
      text: "Topics",
      path: "/topics",
    },
  ];

  const menu: IMenu[] = role === "admin" ? adminMenu : userMenu;

  return (
    <ul className={styles.menu}>
      {menu.map((item: IMenu) => {
        return (
          <li key={item.path} className={styles.menu__item}>
            <NavLink
              end
              className={({ isActive }) =>
                isActive
                  ? `${styles.menu__link} ${styles.active}`
                  : styles.menu__link
              }
              to={item.path}
            >
              {<item.image className={styles.menu__icon} />}
              <span>{item.text}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
