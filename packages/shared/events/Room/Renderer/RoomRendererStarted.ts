export default class RoomRendererStarted extends Event {
    constructor(public readonly id: number) {
        super("RoomRendererStarted");
    }
}
