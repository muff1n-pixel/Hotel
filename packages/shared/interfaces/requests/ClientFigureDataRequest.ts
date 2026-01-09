export default class ClientFigureDataRequest extends Event {
    public readonly id: number = Math.random();

    constructor(public readonly part: string, public readonly gender: string) {
        super("ClientFigureDataRequest");
    }
}
