export default class ClientFurnitureRequest extends Event {
    public readonly id: number = Math.random();

    constructor(public readonly type: string, public readonly size: number, public direction: number, public animation: number = 0, public color: number = 0) {
        super("ClientFurnitureRequest");
    }
}
