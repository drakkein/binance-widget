import React, { useRef } from "react";
import cn from "classnames";

import * as styles from "./menu.module.scss";
import { Link, useRouteMatch } from "react-router-dom";
import useOutsideClick from "../hooks/click-outside";
import { ALTS, STABLE_CURRENCIES } from "../constants";

interface IMenuItem {
  to: string;
}

interface ISubMenu {
  id: string;
  children: React.ReactElement<IMenuItem> | React.ReactElement<IMenuItem>[];
  label: React.ReactNode;
  to: string;
}

const MenuItem: React.FC<IMenuItem> = ({ children, to }) => {
  const match = useRouteMatch({
    path: to,
    exact: true,
  });

  return (
    <li
      role="none"
      className={cn(styles.menuItem, { [styles.menuItemActive]: match })}
    >
      <Link role="menuitem" aria-current={!!match ? "page" : undefined} to={to}>
        {children}
      </Link>
    </li>
  );
};

const SubMenu: React.FC<ISubMenu> = ({ children, id, label, to }) => {
  const ref = useRef<HTMLLIElement>(null);
  const [isOpen, setOpen] = useOutsideClick(ref);

  const match = useRouteMatch({
    path: to,
  });

  return (
    <li role="none" ref={ref} className={styles.subMenu}>
      <button
        id={`${id}_button`}
        aria-haspopup="true"
        aria-controls={id}
        onClick={() => setOpen(!isOpen)}
        className={cn(styles.subMenuButton, {
          [styles.subMenuButtonActive]: match,
        })}
      >
        {label}{" "}
        <i className={cn("fas", isOpen ? "fa-caret-up" : "fa-caret-down")} />
      </button>
      {isOpen && (
        <ul
          id={id}
          role="menu"
          aria-labelledby="menubutton"
          className={styles.subMenuMenu}
        >
          {children}
        </ul>
      )}
    </li>
  );
};

const Menu: React.FC = () => (
  <ul role="menu" className={styles.menu}>
    <MenuItem to="/favorites">
      <i className="fas fa-star" />
    </MenuItem>
    <MenuItem to="/">Margin</MenuItem>
    <MenuItem to="/bnb">BNB</MenuItem>
    <MenuItem to="/btc">BTC</MenuItem>
    <SubMenu id="alts" label="ALTS" to="/alts">
      {ALTS.map((v) => (
        <MenuItem key={v} to={`/alts/${v.toLowerCase()}`}>
          {v}
        </MenuItem>
      ))}
    </SubMenu>
    <SubMenu id="alts" label="USD Ⓢ" to="/stable">
      {STABLE_CURRENCIES.map((v) => (
        <MenuItem key={v} to={`/stable/${v.toLowerCase()}`}>
          {v}
        </MenuItem>
      ))}
    </SubMenu>
  </ul>
);

export default Menu;
