import { useState } from "react";

const useSearch = (): [string | undefined, (val: string) => void] => {
  const [search, setDebouncedSearch] = useState<string | undefined>();

  let handler: NodeJS.Timer;

  // simple debounce
  const setSearch = (val: string) => {
    if (handler) {
      clearTimeout(handler);
    }

    handler = setTimeout(() => {
      setDebouncedSearch(val.length > 0 ? val : undefined);
    }, 500);
  };

  return [search, setSearch];
};

export default useSearch;
