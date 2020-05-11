import React, { useState } from "react";
import cn from "classnames";
import { List, ListRowProps, WindowScroller } from "react-virtualized";
import { Scrollbars } from "react-custom-scrollbars";
import { useParams, Redirect } from "react-router-dom";

import Change from "./change";
import Search from "./search";
import useFavorites from "../hooks/favorites";
import IProduct from "../interfaces/product";
import Toggle from "./toggle";
import useSearch from "../hooks/search";

import * as styles from "./data-list.module.scss";
import {
  ALTS,
  MARGIN_TRADING_AVAILABLE,
  STABLE_CURRENCIES,
} from "../constants";

const LIST_WIDTH = 300; // px

interface IDataList {
  products: IProduct[];
  quoteMarket?: string;
  favorites?: true;
  margin?: true;
}

interface ISort {
  key: keyof IProduct;
  asc: boolean;
}

interface IDataListHeader {
  sort: ISort;
  setSort: React.Dispatch<ISort>;
  viewVolume: boolean;
}

interface IDataHeaderItem {
  sort: ISort;
  setSort: React.Dispatch<ISort>;
  sortKey: keyof IProduct;
}

const rowRenderer = (
  products: IProduct[],
  favorites: [string[], (key: string) => void],
  viewVolume: boolean,
) => ({ key, index, style }: ListRowProps) => {
  const [fav, toggleFav] = favorites;
  const isFavorite = fav.includes(products[index].s);

  return (
    <div
      data-test-id={`pair-${products[index].s}`}
      key={key}
      style={style}
      className={styles.dataListRow}
    >
      <span
        data-test-id="add-favorite"
        data-test-selected={isFavorite}
        onClick={() => toggleFav(products[index].s)}
        className={cn(styles.favorites, {
          [styles.favoritesActive]: isFavorite,
        })}
      >
        <i className="fas fa-star" />
      </span>
      <span>
        {products[index].b}/{products[index].q}
      </span>
      <span>{products[index].c}</span>
      {viewVolume ? (
        <span>{Math.round(products[index].qv)}</span>
      ) : (
        <Change change={products[index].change} />
      )}
    </div>
  );
};

const SortIcon: React.FC<Partial<Pick<ISort, "asc">>> = ({ asc }) => (
  <span
    className={cn(styles.sortIcon, {
      [styles.sortIconActiveAsc]: asc === true,
      [styles.sortIconActiveDesc]: asc === false,
    })}
  >
    <i className="fas fa-sort-up" />
    <i className="fas fa-sort-down" />
  </span>
);

const DataHeaderItem: React.FC<IDataHeaderItem> = ({
  sort,
  sortKey,
  setSort,
  children,
}) => {
  const isActive = sort.key === sortKey;
  const clickHandler = () =>
    setSort({ key: sortKey, asc: isActive ? !sort.asc : true });

  return (
    <span role="columnheader" onClick={clickHandler}>
      {children} <SortIcon asc={isActive ? sort.asc : undefined} />
    </span>
  );
};

const DataListHeader: React.FC<IDataListHeader> = ({
  setSort,
  sort,
  viewVolume,
}) => (
  <div className={styles.dataListHeader}>
    <DataHeaderItem sortKey="b" setSort={setSort} sort={sort}>
      Pair
    </DataHeaderItem>
    <DataHeaderItem sortKey="c" setSort={setSort} sort={sort}>
      Last Price
    </DataHeaderItem>
    {viewVolume ? (
      <DataHeaderItem sortKey="qv" setSort={setSort} sort={sort}>
        Volume
      </DataHeaderItem>
    ) : (
      <DataHeaderItem sortKey="change" setSort={setSort} sort={sort}>
        Change
      </DataHeaderItem>
    )}
  </div>
);

const DataList: React.FC<IDataList> = ({
  products,
  quoteMarket,
  favorites,
  margin,
}) => {
  const [sort, setSort] = useState<ISort>({ key: "b", asc: true });
  const fav = useFavorites();
  const [search, setSearch] = useSearch();
  const [viewVolume, setViewVolume] = useState<boolean>(false);

  const { altCoin, stableCurrency } = useParams();

  let list: IProduct[] = [];

  if (quoteMarket !== undefined) {
    list = products.filter((v) => v.q.toLocaleLowerCase() === quoteMarket);
  }

  if (altCoin && ALTS.map((v) => v.toLowerCase().includes(altCoin))) {
    list = products.filter((v) => v.q.toLocaleLowerCase() === altCoin);
  } else if (altCoin && !ALTS.map((v) => v.toLowerCase()).includes(altCoin)) {
    return <Redirect to="/" />;
  }

  if (
    stableCurrency &&
    STABLE_CURRENCIES.map((v) => v.toLowerCase().includes(stableCurrency))
  ) {
    list = products.filter((v) => v.q.toLocaleLowerCase() === stableCurrency);
  } else if (
    stableCurrency &&
    !STABLE_CURRENCIES.map((v) => v.toLowerCase()).includes(stableCurrency)
  ) {
    return <Redirect to="/" />;
  }

  if (margin) {
    list = list = products.filter((v) =>
      MARGIN_TRADING_AVAILABLE.map((v) => v.toLowerCase()).includes(
        v.q.toLocaleLowerCase(),
      ),
    );
  }

  if (favorites) {
    list = products.filter((v) => fav[0].includes(v.s));
  }

  if (search) {
    list = list.filter((v) => v.b.toLowerCase().includes(search.toLowerCase()));
  }

  const listSorted = list.sort((a, b) => {
    const [h, l] = sort.asc ? [1, -1] : [-1, 1];
    return a[sort.key] > b[sort.key] ? h : l;
  });

  return (
    <div role="grid" className={styles.dataGrid} style={{ width: 300 }}>
      <div className={styles.menu}>
        <Search setSearch={setSearch} />
        <Toggle viewVolume={viewVolume} setValue={setViewVolume} />
      </div>
      <DataListHeader setSort={setSort} sort={sort} viewVolume={viewVolume} />
      <Scrollbars
        style={{ height: 300, width: LIST_WIDTH }}
        renderTrackVertical={(props) => (
          <div className={styles.scrollBar} {...props} />
        )}
      >
        {list.length > 0 &&
        <WindowScroller>
          {({ height, onChildScroll }) => (
            <List
              className={styles.dataList}
              width={LIST_WIDTH - 5}
              height={height}
              rowCount={listSorted.length}
              onScroll={onChildScroll}
              rowHeight={20}
              rowRenderer={rowRenderer(listSorted, fav, viewVolume)}
              style={{ overflowX: "hidden", overflowY: "hidden" }}
            />
          )}
        </WindowScroller>}

        {list.length === 0 && <p style={{textAlign: "center"}}>Loading assets...</p>}
      </Scrollbars>
    </div>
  );
};

export default DataList;
