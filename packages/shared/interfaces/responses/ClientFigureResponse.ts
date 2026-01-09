export default class ClientFigureResponse extends Event {
    constructor(public readonly id: number, public readonly tempUserArgument: "user", public readonly image: OffscreenCanvas) {
        super("ClientFigureResponse");
    }
}
