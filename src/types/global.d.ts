declare global {
  interface Window {
    geocodeTimeout?: NodeJS.Timeout;
  }
}

export {};
