export type TypedEventTarget = EventTarget & {
    addEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: AddEventListenerOptions | boolean): void;
};
