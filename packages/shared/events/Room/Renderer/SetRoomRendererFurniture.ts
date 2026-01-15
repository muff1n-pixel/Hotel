export default class SetRoomRendererFurniture extends Event {
    constructor(public readonly type: string, public readonly size: number, public direction: number | undefined = undefined, public animation: number = 0, public color: number = 0) {
        super("SetRoomRendererFurniture");
    }
}
