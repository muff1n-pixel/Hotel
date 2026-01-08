export default class ClientFigureRequest extends Event {
    constructor(public readonly tempUserArgument: "user") {
        super("ClientFigureRequest");
    }
}
