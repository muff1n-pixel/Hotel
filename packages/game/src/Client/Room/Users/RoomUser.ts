import RoomInstance from "@Client/Room/RoomInstance";
import Figure from "@Client/Figure/Figure";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { RoomUserData } from "@pixel63/events";

export default class RoomUser {
    public readonly figure: Figure;
    public readonly item: RoomFigureItem;

    constructor(private readonly instance: RoomInstance, public data: RoomUserData) {
        this.figure = new Figure(this.data.figureConfiguration, this.data.direction ?? 0);
        this.item = new RoomFigureItem(this.instance.roomRenderer, this.figure, this.data.position);

        this.instance.roomRenderer.addItem(this.item);

        this.updateData(data);
    }

    public updateData(data: RoomUserData) {        
        this.data = data;

        if(data.direction !== undefined) {
            this.item.figureRenderer.direction = this.data.direction = data.direction;
        }

        if(data.position) {
            this.item.setPosition(data.position);
        }

        if(data.hasRights !== undefined) {
            this.data.hasRights = data.hasRights;

            if(this.instance.clientInstance.user.value?.id === data.id) {
                this.instance.hasRights = data.hasRights;
            }
        }

        if(data.figureConfiguration !== undefined) {
            this.data.figureConfiguration = data.figureConfiguration;
            this.item.figureRenderer.configuration = data.figureConfiguration;
        }

        if(data.typing !== undefined) {
            this.item.typing = data.typing;
        }

        if(data.idling !== undefined) {
            if(data.idling) {
                this.item.figureRenderer.addAction("Sleep");
            }
            else {
                this.item.figureRenderer.removeAction("Sleep");
            }

            this.item.idling = data.idling;
        }

        if(data.motto !== undefined) {
            this.data.motto = data.motto;
        }

        if(data.actions.length) {
            this.item.figureRenderer.setActions(data.actions);
        }

        if(data.updateHealth) {
            this.item.health = (data.health !== undefined)?(data.health):(null);
        }
    }
}
