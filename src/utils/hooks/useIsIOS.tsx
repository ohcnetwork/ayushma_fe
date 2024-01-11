import { useEffect, useState } from "react";

export default function useIsIOS() {
  const [isIOS, setIsIOS] = useState<boolean>();

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  return isIOS;
}
