import ClientInstance from "@Client/ClientInstance";
import RoomRenderer from "./RoomRenderer";
import Figure from "@Client/Figure/Figure";
import RoomFigureItem from "./Items/Figure/RoomFigureItem";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { clientInstance, webSocketClient } from "../..";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomBot from "@Client/Room/Bots/RoomBot";
import { RoomActorIdentifierData, RoomClickData, RoomDoubleClickData, RoomInformationData, RoomLoadData, RoomPositionData, RoomStructureData, RoomUserData, SendRoomUserWalkData, UpdateRoomFurnitureData, UserFurnitureData, UserFurnitureMoodlightData, UserFurnitureTonerData } from "@pixel63/events";
import RoomPet from "@Client/Room/Pets/RoomPet";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";
import { RoomLogger } from "@pixel63/shared/Logger/Logger";
import RoomDoubleClickEvent from "@Client/Events/RoomDoubleClickEvent";
import RoomFurnitureStackHelperLogic from "@Client/Room/Furniture/Logic/RoomFurnitureStackHelperLogic";

type RoomItem<DataType = RoomUserData | UserFurnitureData, ItemType = RoomFigureItem | RoomFurnitureItem> = {
    data: DataType;
    item: ItemType;
};

export type RoomInstanceFurniture = RoomItem<UserFurnitureData, RoomFurnitureItem>;

export type RoomUser = RoomItem<Required<RoomUserData>, RoomFigureItem>;

export type HoveredFigure = {
    type: "user";
    item: RoomFigureItem;
    user: RoomUser;
} | {
    type: "bot";
    item: RoomFigureItem;
    bot: RoomBot
};

export default class RoomInstance {
    public readonly key = Math.random();

    public readonly id: string;

    public readonly roomRenderer: RoomRenderer;

    public readonly users: RoomUser[] = [];
    public furnitures: RoomFurniture[] = [];
    public bots: RoomBot[] = [];
    public pets: RoomPet[] = [];

    public information?: RoomInformationData;
    public hasRights: boolean;

    constructor(public readonly clientInstance: ClientInstance, event: RoomLoadData) {
        this.id = event.id;
        
        if(event.information) {
            this.information = event.information;
        }

        this.hasRights = event.hasRights;
        
        this.roomRenderer = new RoomRenderer(clientInstance.element, clientInstance, this, event.structure);

        if(event.structure) {
            this.setStructure(event.structure);
        }

        for(const user of event.users) {
            this.users.push(this.addUser(user as Required<RoomUserData>));
        }

        for(const furniture of event.furniture) {
            const furnitureData = event.furnitureData.find((furnitureData) => furnitureData.id === furniture.furnitureId);

            if(!furnitureData) {
                RoomLogger.error("Server did not send furniture data for user furniture!", {
                    furniture
                });

                continue;
            }

            this.furnitures.push(new RoomFurniture(this, furnitureData, furniture));
        }

        for(const bot of event.bots) {
            this.bots.push(new RoomBot(this, bot));
        }

        for(const pet of event.pets) {
            this.pets.push(new RoomPet(this, pet));
        }

        this.registerEventListeners();
    }

    public setStructure(structure: RoomStructureData) {
        this.roomRenderer.setStructure(structure);

        this.clientInstance.roomInstance.update();
    }

    public setMoodlight(moodlight?: UserFurnitureMoodlightData) {
        this.roomRenderer.lighting.setMoodlightData(moodlight);
    }

    public setBackgroundToner(backgroundToner: UserFurnitureTonerData) {
        this.roomRenderer.lighting.setBackgroundTonerData(backgroundToner);
    }

    public terminate() {
        this.removeEventListeners();

        this.roomRenderer.terminate();

        AssetFetcher.clearMemory();

        this.clientInstance.roomInstance.value = undefined;
    }

    private registerEventListeners() {
        webSocketClient.addEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.addEventListener("click", this.click.bind(this));
        this.roomRenderer.cursor?.addEventListener("doubleclick", this.doubleclick.bind(this));
    }

    private removeEventListeners() {
        webSocketClient.removeEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.removeEventListener("click", this.click.bind(this));
        this.roomRenderer.cursor?.removeEventListener("doubleclick", this.doubleclick.bind(this));
    }

    private leaveRoomListener = this.leaveRoom.bind(this);
    private leaveRoom() {
        this.terminate();
    }

    private lastSentClickEvent: number = 0;

    private click(event: Event) {
        if(!(event instanceof RoomClickEvent)) {
            return;
        }

        if(performance.now() - this.lastSentClickEvent >= 500) {
            if(event.otherEntity) {
                if(event.otherEntity.item instanceof RoomFurnitureItem) {
                    const roomFurniture = this.getFurnitureByItem(event.otherEntity.item);

                    webSocketClient.sendProtobuff(RoomClickData, RoomClickData.create({
                        furnitureId: roomFurniture.data.id,
                        position: event.otherEntity.position
                    }));

                    this.lastSentClickEvent = performance.now();
                }
                else if(event.otherEntity.item instanceof RoomFigureItem && event.otherEntity.item.type === "figure") {
                    const roomUser = this.getUserByItem(event.otherEntity.item);

                    webSocketClient.sendProtobuff(RoomClickData, RoomClickData.create({
                        userId: roomUser.data.id,
                        position: event.otherEntity.position
                    }));

                    this.lastSentClickEvent = performance.now();
                }
            }
            else if(event.floorEntity?.position) {
                webSocketClient.sendProtobuff(RoomClickData, RoomClickData.create({
                    position: RoomPositionData.fromJSON(event.floorEntity.position)
                }));

                this.lastSentClickEvent = performance.now();
            }
        }

        if(this.roomRenderer.cursor?.cursorDisabled) {
            return;
        }

        if(event.floorEntity?.position && !(event.otherEntity?.item instanceof RoomFigureItem)) {
            webSocketClient.sendProtobuff(SendRoomUserWalkData, SendRoomUserWalkData.create({
                target: RoomPositionData.fromJSON(event.floorEntity.position)
            }));
        }
    }

    private doubleclick(event: Event) {
        if(!(event instanceof RoomDoubleClickEvent)) {
            return;
        }

        console.log("DOUBLE CLICK", event);

        if(event.floorEntity?.position) {
            webSocketClient.sendProtobuff(RoomDoubleClickData, RoomDoubleClickData.create({
                position: RoomPositionData.fromJSON(event.floorEntity.position)
            }));
        }
    }

    public addUser(userData: Required<RoomUserData>): RoomUser {
        const figureRenderer = new Figure(userData.figureConfiguration, userData.direction, userData.actions);
        const item = new RoomFigureItem(this.roomRenderer, figureRenderer, userData.position);

        item.idling = userData.idling;
        item.typing = userData.typing;
        
        if(item.idling) {
            item.figureRenderer.addAction("Sleep");
        }

        this.roomRenderer.items.push(item);

        return {
            data: userData,
            item
        };
    }

    public removeUser(userId: string) {
        const user = this.getUserById(userId);

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(user.item), 1);
        this.users.splice(this.users.indexOf(user), 1);
        
        if(this.roomRenderer.focusedItem.value?.id === user.item.id) {
            this.roomRenderer.focusedItem.value = null;
        }
        
        clientInstance.roomInstance.update();
    }

    public getUserById(userId: string) {
        const user = this.users.find((user) => user.data.id === userId);

        if(!user) {
            throw new Error("User does not exist in room.");
        }

        return user;
    }

    public getUserByItem(item: RoomFigureItem) {
        const user = this.users.find((user) => user.item.id === item.id);

        if(!user) {
            throw new Error("User does not exist in room.");
        }

        return user;
    }

    public getBotByItem(item: RoomFigureItem) {
        const bot = this.bots.find((bot) => bot.item.id === item.id);

        if(!bot) {
            throw new Error("Bot does not exist in room.");
        }

        return bot;
    }

    public getActor(data?: RoomActorIdentifierData) {
        if(data?.user) {
            return this.getUserById(data.user.userId);
        }

        if(data?.bot) {
            return this.getBotById(data.bot.botId);
        }

        if(data?.pet) {
            return this.getPetById(data.pet.petId);
        }

        throw new Error("Unhandled actor type.");
    }

    public getBotById(id: string) {
        const bot = this.bots.find((bot) => bot.data.id === id);

        if(!bot) {
            throw new Error("Bot does not exist in room.");
        }

        return bot;
    }

    public getPetById(id: string) {
        const pet = this.pets.find((pet) => pet.data.id === id);

        if(!pet) {
            throw new Error("Pet does not exist in room.");
        }

        return pet;
    }

    public getPetByItem(item: RoomPetItem) {
        const pet = this.pets.find((pet) => pet.item.id === item.id);

        if(!pet) {
            throw new Error("Pet does not exist in room.");
        }

        return pet;
    }

    public removePet(petId: string) {
        const pet = this.getPetById(petId);

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(pet.item), 1);
        this.pets.splice(this.pets.indexOf(pet), 1);

        if(this.roomRenderer.focusedItem.value?.id === pet.item.id) {
            this.roomRenderer.focusedItem.value = null;
        }
        
        clientInstance.roomInstance.update();
    }

    public getFurnitureById(id: string) {
        const furniture = this.furnitures.find((furniture) => furniture.data.id === id);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        return furniture;
    }

    public getFurnitureByItem(item: RoomFurnitureItem) {
        const furniture = this.furnitures.find((furniture) => furniture.item.id === item.id);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        return furniture;
    }

    public removeFurniture(roomFurnitureId: string, hideFlyingFurniture?: boolean) {
        const furniture = this.getFurnitureById(roomFurnitureId);

        if(furniture.data.userId === this.clientInstance.user.value?.id && !hideFlyingFurniture) {
            this.clientInstance.flyingFurnitureIcons.value?.push({
                id: roomFurnitureId,
                furniture: furniture.furnitureData,
                targetElementId: "toolbar-inventory",
                position: this.roomRenderer.getItemScreenPosition(furniture.item)
            });
            
            this.clientInstance.flyingFurnitureIcons.update();
        }

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(furniture.item), 1);
        this.furnitures.splice(this.furnitures.indexOf(furniture), 1);

        this.clientInstance.roomInstance.update();
    }

    public removeBot(botId: string) {
        const bot = this.getBotById(botId);

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(bot.item), 1);
        this.bots.splice(this.bots.indexOf(bot), 1);

        if(this.roomRenderer.focusedItem.value?.id === bot.item.id) {
            this.roomRenderer.focusedItem.value = null;
        }

        clientInstance.roomInstance.update();
    }

    public moveFurniture(roomFurnitureId: string) {
        if(!this.hasRights) {
            return;
        }
        
        const furniture = this.getFurnitureById(roomFurnitureId);

        const roomFurniturePlacer = new RoomFurniturePlacer(this, furniture.item);

        roomFurniturePlacer.startPlacing((position, direction) => {
            roomFurniturePlacer.destroy();

            webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
                id: furniture.data.id,

                position,
                direction
            }));
        }, () => {
            roomFurniturePlacer.destroy();
        });
    }
    
    public getFurnitureAtUpmostPosition(position: Omit<RoomPositionData, "depth">, dimensions: RoomPositionData = RoomPositionData.create({ row: 1, column: 1, depth: 0 }), ignoreRoomFurnitureItemId?: number) {
        const furniture = this.furnitures
            .filter((furniture) => furniture.item.id !== ignoreRoomFurnitureItemId)
            .filter((furniture) => furniture.isPositionInside(position, dimensions));

        const stackHelperFurniture = furniture.find((furniture) => furniture.getLogic() instanceof RoomFurnitureStackHelperLogic);

        if(stackHelperFurniture) {
            return stackHelperFurniture;
        }

        return furniture.toSorted((a, b) => (b.item.position?.depth ?? 0) - (a.item.position?.depth ?? 0))[0];
    }
}
