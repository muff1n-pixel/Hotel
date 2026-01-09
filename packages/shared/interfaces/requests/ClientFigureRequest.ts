export default class ClientFigureRequest extends Event {
    public readonly id: number = Math.random();

    constructor(public readonly tempUserArgument: "user", public readonly direction: number = 2) {
        super("ClientFigureRequest");
    }
}
