export type Listener<T> = (value: T | undefined) => void;

export default class ObservableProperty<T> {
    private _value?: T;
    private listeners = new Set<Listener<T>>();

    get value(): T | undefined {
        return this._value;
    }

    set value(value: T | undefined) {
        this._value = value;
        this.listeners.forEach(l => l(value));
    }

    subscribe(listener: Listener<T>) {
        this.listeners.add(listener);
        
        return () => {
            this.listeners.delete(listener);
        };
    }
};
