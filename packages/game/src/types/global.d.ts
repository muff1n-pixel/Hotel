export {};

declare global {
  interface Window {
    generateAvatar?: () => Promise<string>;
  }
}