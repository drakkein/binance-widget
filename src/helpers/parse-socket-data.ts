import ISocketProduct from "../interfaces/socket-product";
import IProduct from "../interfaces/product";

const parseSocketData = (
  data: ISocketProduct,
): Pick<IProduct, "c" | "o" | "h" | "l" | "v"> => ({
  c: Number(data.c),
  o: Number(data.o),
  h: Number(data.h),
  l: Number(data.l),
  v: Number(data.v),
});

export default parseSocketData;
