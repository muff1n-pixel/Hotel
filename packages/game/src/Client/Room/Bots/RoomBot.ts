import RoomInstance from "@Client/Room/RoomInstance";
import Figure from "@Client/Figure/Figure";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { UserBotData } from "@Shared/Interfaces/Room/RoomBotData";

export default class RoomBot {
    public readonly figure: Figure;
    public readonly item: RoomFigureItem;

    constructor(private readonly instance: RoomInstance, public data: UserBotData) {
        this.figure = new Figure(this.data.figureConfiguration, this.data.direction);
        this.item = new RoomFigureItem(this.instance.roomRenderer, this.figure, this.data.position);
        this.item.type = "bot";

        this.instance.roomRenderer.items.push(this.item);

        this.updateData(data);
    }

    public updateData(data: UserBotData) {        
        this.data = data;

        this.item.figureRenderer.direction = this.data.direction = data.direction;

        if(data.position) {
            this.item.setPosition(data.position);
        }
    }
}
