import { RoomActorActionData } from "@pixel63/events";
import RoomActorPose from "./RoomActorPose";
import RoomActor from "../RoomActor";

export default class RoomPetPose implements RoomActorPose {
    public posture: string = "std";
    
    constructor(private readonly actor: RoomActor) {

    }

    public sit(): void {
        this.setPosture("sit");
    }

    public lay(): void {
        this.setPosture("lay");
    }

    public eat(): void {
        this.setPosture("eat");
    }

    public beg(): void {
        this.setPosture("beg");
    }

    public dead(): void {
        this.setPosture("ded");
    }

    public play(): void {
        this.setPosture("pla");
    }

    public jump(): void {
        this.setPosture("jmp");
    }

    public wave(): void {
        
    }

    public smile() {
        
    }
    
    public laugh() {
        
    }
    
    public sad() {
        
    }
    
    public angry() {
        
    }
    
    public surprised() {
        
    }

    public pet(): void {
        
    }

    public isSitting(): boolean {
        return this.posture === "sit";
    }

    public stand(): void {
        this.setPosture("std");
    }
    
    public setPosture(posture: string) {
        this.posture = posture;

        if(posture === "sit") {
            if(this.actor.direction % 2) {
                this.actor.path.setDirection((this.actor.direction + 1) % 8);
            }
        }
        
        this.actor.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: this.actor.getActorIdentifier(),
            
            posture: this.posture
        }));
    }
}