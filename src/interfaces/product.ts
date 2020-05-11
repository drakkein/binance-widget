interface IProduct {
  s: string;
  st: string;
  b: string; // base asset
  q: string; // quote asset
  ba: string;
  qa: string;
  i: number;
  ts: number;
  an: string;
  qn: string;
  o: number; // open price
  h: number; // high price
  l: number; // low price
  c: number; // latest price
  v: number;
  qv: number;
  y: number;
  as: number;
  pm: string; // parent market
  pn: string; // category of parent market
  cs: number;
  etf: boolean;
  change: string;
}

export default IProduct;
