import { useState, useCallback } from "react";

export function useRandom<T>(items: T[]) {
  const [last, setLast] = useState<T | null>(null);

  const pick = useCallback((): T => {
    if (items.length === 0) throw new Error("items is empty");
    if (items.length === 1) return items[0];

    let choice: T;
    do {
      choice = items[Math.floor(Math.random() * items.length)];
    } while (choice === last);

    setLast(choice);
    return choice;
  }, [items, last]);

  return pick;
}
