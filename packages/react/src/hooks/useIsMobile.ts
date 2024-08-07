import { useLayoutEffect, useState } from 'react';
import { isMobile } from '../utils/index.js';

export default function useIsMobile() {
  const [mobile, setMobile] = useState(isMobile());

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    setMobile(isMobile());
  }, []);

  return mobile;
}
