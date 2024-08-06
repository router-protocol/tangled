import { detect } from 'detect-browser';

const detectBrowser = () => {
  const browser = detect();
  return browser?.name ?? '';
};
const detectOS = () => {
  const browser = detect();
  return browser?.os ?? '';
};

const isIOS = () => {
  const os = detectOS();
  return os.toLowerCase().includes('ios');
};
const isAndroid = () => {
  const os = detectOS();
  return os.toLowerCase().includes('android');
};
const isMobile = () => {
  return isAndroid() || isIOS();
};

export { detectBrowser, detectOS, isAndroid, isIOS, isMobile };
