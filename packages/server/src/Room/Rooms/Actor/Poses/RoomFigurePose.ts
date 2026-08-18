import { RoomActorActionData } from "@pixel63/events";
import { RoomActorAction } from "../RoomActorAction";
import RoomActorPose from "./RoomActorPose";
import WiredTriggerUserPerformsActionLogic from "../../Furniture/Logic/Wired/Trigger/WiredTriggerUserPerformsActionLogic";
import RoomUser from "../../Users/RoomUser";
import RoomActor from "../RoomActor";

export default class RoomFigurePose implements RoomActorPose {
    private actions: RoomActorAction[] = [];
    
    constructor(private readonly actor: RoomActor) {

    }

    public sit(): void {
        this.addAction("Sit");
    }

    public isSitting(): boolean {
        return this.hasAction("Sit");
    }

    public stand(): void {
        this.removeAction("Sit");
    }

    public wave(): void {
        this.addAction("Wave");
    }

    public smile() {
        this.addAction("GestureSmile");
    }
    
    public laugh() {
        this.addAction("Laugh");
    }
    
    public sad() {
        this.addAction("GestureSad");
    }
    
    public angry() {
        this.addAction("GestureAngry");
    }

    public pet(): void {
        this.addAction("CarryItem", 1000);
    }
    
    public surprised() {
        this.addAction("GestureSurprised");
    }

    public setEffect(effect: string, duration?: number) {
        this.addAction(effect, duration);
    }

    public hasEffect(effect: string) {
        return this.hasAction(effect);
    }

    public removeEffect() {
        this.removeAction("AvatarEffect");
        this.removeAction("CarryItem");
        this.removeAction("Dance");
        this.removeAction("Sign");
    }

    public handleActionsInterval() {
        for(const action of this.actions) {
            if(action.expiresAt === undefined) {
                continue;
            }

            if(performance.now() > action.expiresAt) {
                this.removeAction(action.id);
            }
        }
    }

    public getActions() {
        return this.actions.map((action) => action.id);
    }
    
    private hasAction(actionId: string): boolean {
        return this.actions.some((action) => action.id === actionId);
    }

    private addAction(action: string, removeAfterMs?: number, sendProtobuff: boolean = true): RoomActorActionData | null {
        if(this.hasAction(action)) {
            return null;
        }

        if(action === "Sit") {
            if(this.actor.direction % 2) {
                this.actor.path.setDirection((this.actor.direction + 1) % 8);
            }
        }

        if(["Wave", "GestureSmile", "GestureSad", "GestureAngry", "GestureSurprised", "Laugh", "Snowboard360", "SnowboardOllie"].includes(action)) {
            removeAfterMs = 2000;
        }

        if(action.startsWith("Sign")) {
            removeAfterMs = 5000;
        }

        if(action.startsWith("CarryItem") && removeAfterMs === undefined) {
            removeAfterMs = 2 * 60 * 1000;
        }

        this.actions.push({
            id: action,
            expiresAt: (removeAfterMs !== undefined)?(performance.now() + removeAfterMs):(undefined)
        });

        const roomActorActionData = RoomActorActionData.create({
            actor: this.actor.getActorIdentifier(),
            
            actionsAdded: [action]
        });

        if(sendProtobuff) {
            this.actor.room.sendProtobuff(RoomActorActionData, roomActorActionData);
        }

        if(this.actor instanceof RoomUser) {
            for(const logic of this.actor.room.getFurnitureWithCategory(WiredTriggerUserPerformsActionLogic)) {
                logic.handleUserAction(this.actor, action).catch(console.error);
            }
        }

        return roomActorActionData;
    }

    private removeAction(action: string) {
        const actionId = action.split('.')[0]!;

        const existingActionIndex = this.actions.findIndex((action) => action.id.split('.')[0] === actionId);

        if(existingActionIndex === -1) {
            return;
        }

        this.actions.splice(existingActionIndex, 1);

        this.actor.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: this.actor.getActorIdentifier(),
            
            actionsRemoved: [actionId]
        }));
    }
}