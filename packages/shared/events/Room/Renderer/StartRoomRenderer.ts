export default class StartRoomRenderer extends Event {
    public readonly id = Math.random();

    constructor(public readonly element: HTMLDivElement) {
        super("StartRoomRenderer");
    }
}
