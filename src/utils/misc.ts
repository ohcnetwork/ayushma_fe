/**
 * `true` if device is an iOS device, else `false`
 */
export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
