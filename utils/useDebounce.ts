import { useEffect, useState } from 'react';

export function useDebounce<T>(value: any, delay: number = 500) {
  // state to hold the debounced value
  const [debounced, setDebounced] = useState(value);

  // effect to update debounced value after the specified delay
  useEffect(() => {
    // set a timer to update the debounced value
    const timer = setTimeout(() => setDebounced(value), delay);

    // cleanup the timer when the effect is re-run or component unmounts
    return () => clearTimeout(timer);
  }, [value, delay]);

  // return the debounced value
  return debounced as T;
}
