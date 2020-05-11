import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Menu from "./menu";
import useProducts from "../hooks/products";
import DataList from "./data-list";

import * as styles from "./widget.module.scss";

const Widget: React.FC = () => {
  const [products, websocketClose] = useProducts();

  return (
    <div className={styles.widget}>
      <h2 className={styles.header}>Market</h2>
      <Router>
        <Menu />
        <Switch>
          <Route path="/favorites">
            <DataList products={products} favorites />
          </Route>
          <Route path="/bnb">
            <DataList products={products} quoteMarket="bnb" />
          </Route>
          <Route path="/btc">
            <DataList products={products} quoteMarket="btc" />
          </Route>
          <Route path="/alts/:altCoin">
            <DataList products={products} quoteMarket="trx" />
          </Route>
          <Route path="/stable/:stableCurrency">
            <DataList products={products} quoteMarket="trx" />
          </Route>
          <Route path="/">
            <DataList products={products} margin />
          </Route>
        </Switch>
      </Router>
      <button onClick={websocketClose}>Close websocket connection</button>
      <p>Will automatically reconnect</p>
    </div>
  );
};

export default Widget;
