import { useEffect, useState } from 'react';

/**
 * Check if the code is running on the client side
 * @returns boolean
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
