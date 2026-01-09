type Item = {
    image: OffscreenCanvas;
    setId: string;
};

type Color = {
    id: number;
    color?: string;
};

export default class ClientFigureDataResponse extends Event {
    constructor(public readonly id: number, public readonly items: Item[], public readonly colors: Color[]) {
        super("ClientFigureDataResponse");
    }
}
