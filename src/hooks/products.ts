import { useEffect, useRef, useState } from "react";

import IProduct from "../interfaces/product";
import ISocketProduct from "../interfaces/socket-product";
import calculateChange from "../helpers/calculate-change";
import parseSocketData from "../helpers/parse-socket-data";

const API_LINK = "/exchange-api/v1/public/asset-service/product/get-products";
const WEBSOCKET_LINK =
  "wss://stream.binance.com/stream?streams=!miniTicker@arr";

interface IResponse {
  code: string;
  message?: string;
  messageDetail?: string;
  data: IProduct[];
  success: boolean;
}

const useProducts = (): [IProduct[], () => void] => {
  const [productsInitial, setProductsInitial] = useState<IProduct[]>([]);
  const [socketData, setSocketData] = useState<ISocketProduct[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  let websocket = useRef<WebSocket>();

  useEffect(() => {
    const openWebsocket = () => {
      websocket.current = new WebSocket(WEBSOCKET_LINK);

      websocket.current.onopen = () => {
        console.log("Websocket connection is open");
      };

      websocket.current.onmessage = (event) => {
        const data: ISocketProduct[] = JSON.parse(event.data).data;

        setSocketData(data);
      };

      websocket.current.onclose = () => {
        console.log("Websocket connection closed, restarting in 500ms");
        setTimeout(() => {
          openWebsocket();
        }, 500);
      };
    };

    openWebsocket();
  }, [websocket]);

  useEffect(() => {
    (async function () {
      const request = await fetch(API_LINK);
      const response: IResponse = await request.json();

      const withChange = response.data.map<IProduct>((p) => ({
        ...p,
        change: calculateChange(p.o, p.c),
      }));

      setProductsInitial(withChange);
    })();
  }, []);

  useEffect(() => {
    const productsUpdated = productsInitial.map((pr) => {
      const fromSocket = socketData.find((v) => v.s === pr.s);

      if (fromSocket) {
        const parsedData = parseSocketData(fromSocket);
        return {
          ...pr,
          ...parsedData,
          change: calculateChange(parsedData.o, parsedData.c),
        };
      }

      return pr;
    });

    if (productsUpdated.length > 0) {
      setProducts(productsUpdated);
    }
  }, [productsInitial, socketData]);

  const closeWebsocket = () => {
    if (!websocket.current) {
      return;
    }
    console.log("Closing websocket...");
    websocket.current.close();
  };

  return [products, closeWebsocket];
};

export default useProducts;
