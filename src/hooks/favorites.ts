import { useEffect, useState } from "react";

const useFavorites = (): [string[], (key: string) => void] => {
  const localStorage = window.localStorage;
  const initialState = localStorage.getItem("favorites");
  const [favorites, setFavorites] = useState<string[]>(
    initialState ? JSON.parse(initialState) : [],
  );

  useEffect(() => {
    const favoritesJSON = JSON.stringify(favorites);
    localStorage.setItem("favorites", favoritesJSON);
  }, [favorites, localStorage]);

  const toggleFavorites = (key: string) => {
    const hasKey = favorites.includes(key);
    const newFavorites = hasKey
      ? [...favorites].filter((v) => v !== key)
      : [...favorites, key];

    setFavorites(newFavorites);
  };

  return [favorites, toggleFavorites];
};

export default useFavorites;
