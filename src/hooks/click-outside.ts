import React, { useEffect, useState } from "react";

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
): [boolean, React.Dispatch<boolean>] => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return [isOpen, setOpen];
};

export default useOutsideClick;
