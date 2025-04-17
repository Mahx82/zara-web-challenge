import { useEffect, useState } from 'react';

export function useLoader(isVisible: boolean) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVisible) {
      setVisible(true);
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 2;
          return prev;
        });
      }, 100);
    } else {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => clearInterval(interval);
  }, [isVisible]);

  return { progress, isLoaderVisible: visible };
}
