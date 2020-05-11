import React from "react";

import * as styles from "./search.module.scss";

interface ISearch {
  setSearch: (val: string) => void;
}

const Search: React.FC<ISearch> = ({ setSearch }) => (
  <div className={styles.search}>
    <input
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(e.target.value)
      }
      name="search"
      placeholder="Search"
    />
    <i className="fas fa-search" />
  </div>
);

export default Search;
