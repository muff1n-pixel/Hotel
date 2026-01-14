export default class ClientFurnitureResponse extends Event {
    constructor(public readonly id: number, public readonly image: ImageBitmap) {
        super("ClientFurnitureResponse");
    }
}
