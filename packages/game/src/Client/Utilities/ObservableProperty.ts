export type Listener<T> = (value: T | undefined) => void;

export default class ObservableProperty<T, Value = T> {
    private _value?: Value;
    private listeners = new Set<Listener<Value>>();

    constructor(initialValue?: Value) {
        this.value = initialValue;
    }

    public state: number = performance.now();

    get value(): Value | undefined {
        return this._value;
    }

    set value(value: Value | undefined) {
        this._value = value;
        this.listeners.forEach(l => l(value));
    }

    subscribe(listener: Listener<Value>) {
        listener(this._value);
        
        this.listeners.add(listener);
        
        return () => {
            this.listeners.delete(listener);
        };
    }

    update() {
        this.state = performance.now();

        this.listeners.forEach(l => l(this._value));
    }
};
