export type Listener<T> = (value: T) => void;

export default class ObservableRequiredProperty<T, Value = T> {
    private _value: Value;
    private listeners = new Set<Listener<Value>>();

    constructor(initialValue: Value) {
        this.value = initialValue;
        this._value = initialValue;
    }

    public state: number = performance.now();

    get value(): Value {
        return this._value;
    }

    set value(value: Value) {
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
