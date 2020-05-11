import React from "react";

import * as styles from "./change.module.scss";

interface IChange {
  change: string;
}

const Change: React.FC<IChange> = ({ change }) => {
  // naive check
  const isPositive = change.charAt(0) !== "-";

  return (
    <span
      className={isPositive ? styles.changePositive : styles.changeNegative}
    >
      {change}
    </span>
  );
};

export default Change;
