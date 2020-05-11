const calculateChange = (openPrice: number, currentPrice: number): string => {
  const diff = currentPrice - openPrice;
  const change = (diff / openPrice) * 100;

  return `${change.toFixed(2)}%`;
};

export default calculateChange;
