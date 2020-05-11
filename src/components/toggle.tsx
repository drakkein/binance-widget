import React from "react";

import * as styles from "./toggle.module.scss";

interface IToggle {
  viewVolume: boolean;
  setValue: React.Dispatch<boolean>;
}

const Toggle: React.FC<IToggle> = ({ setValue, viewVolume }) => {
  const handler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.currentTarget.value === "volume");

  return (
    <div className={styles.toggle}>
      <div className={styles.toggleInput}>
        <input
          onChange={handler}
          type="radio"
          id="change"
          name="view"
          value="change"
          checked={!viewVolume}
        />
        <label htmlFor="change" aria-checked={!viewVolume}>
          Change
        </label>
      </div>
      <div className={styles.toggleInput}>
        <input
          onChange={handler}
          type="radio"
          id="volume"
          name="view"
          value="volume"
          checked={viewVolume}
        />
        <label htmlFor="volume">Volume</label>
      </div>
    </div>
  );
};

export default Toggle;
