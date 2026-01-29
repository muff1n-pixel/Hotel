import Furniture from "@Client/Furniture/Furniture";
import RoomRenderer from "./Renderer";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { UserFurnitureData } from "@Shared/Interfaces/User/UserFurnitureData";
import RoomInstance from "@Client/Room/RoomInstance";

export default class RoomFurniturePlacer {
    private paused: boolean = true;

    private onPlace?: (position: RoomPosition, direction: number) => void;
    private onCancel?: () => void;

    private readonly renderListener = this.render.bind(this);
    private readonly clickListener = this.click.bind(this);

    private readonly iconElement: HTMLCanvasElement;

    private readonly originalPosition?: RoomPosition;

    public static fromFurnitureData(roomInstance: RoomInstance, furnitureData: FurnitureData) {
        const roomFurnitureItem = new RoomFurnitureItem(
            new Furniture(furnitureData.type, 64, undefined, 0, furnitureData.color)
        );

        return new RoomFurniturePlacer(roomInstance, roomFurnitureItem, true);
    }

    constructor(private readonly roomInstance: RoomInstance, private readonly roomFurnitureItem: RoomFurnitureItem, private readonly temporaryFurniture: boolean = false) {
        if(this.roomInstance.roomRenderer.furniturePlacer) {
            this.roomInstance.roomRenderer.furniturePlacer.destroy();
        }

        if(roomFurnitureItem.position) {
            this.originalPosition = {
                row: roomFurnitureItem.position.row,
                column: roomFurnitureItem.position.column,
                depth: roomFurnitureItem.position.depth
            };
        }

        //this.furnitureRenderer = new FurnitureRenderer(userFurnitureData.furnitureData.type, 64, undefined, 0, userFurnitureData.furnitureData.color);

        /*this.furnitureItem = new RoomFurnitureItem(this.furnitureRenderer, {
            row: 0,
            column: 0,
            depth: 0
        });*/

        this.roomFurnitureItem.disabled = true;
        this.roomFurnitureItem.alpha = 0.5;

        if(this.roomInstance.roomRenderer.cursor) {
            this.roomInstance.roomRenderer.cursor.cursorDisabled = true;
        }

        if(!this.roomInstance.roomRenderer.items.includes(this.roomFurnitureItem)) {
            this.roomInstance.roomRenderer.items.push(this.roomFurnitureItem);
        }

        this.roomInstance.roomRenderer.addEventListener("render", this.renderListener);
        this.roomInstance.roomRenderer.element.addEventListener("click", this.clickListener);

        this.iconElement = document.createElement("canvas");
        this.iconElement.style.display = "none";
        this.iconElement.style.position = "fixed";
        this.iconElement.style.pointerEvents = "none";
        this.iconElement.style.transform = "translate(-50%, -50%)";

        new Furniture(this.roomFurnitureItem.furnitureRenderer.type, 1, 0, 0, this.roomFurnitureItem.furnitureRenderer.color).renderToCanvas().then((image) => {
            this.iconElement.width = image.width;
            this.iconElement.height = image.height;

            const context = this.iconElement.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.drawImage(image, 0, 0);
        });
        
        this.roomInstance.roomRenderer.parent.appendChild(this.iconElement);
    }

    private render() {
        if(this.paused) {
            return;
        }

        const entity = this.roomInstance.roomRenderer.getItemAtPosition((item) => item.type === this.roomFurnitureItem.furnitureRenderer.placement);

        if(entity) {
            const furnitureAtPosition = (this.roomFurnitureItem.furnitureRenderer.placement === "floor") && this.roomInstance.getFurnitureAtUpmostPosition(
                {
                    row: entity.position.row,
                    column: entity.position.column
                },
                this.roomFurnitureItem.furnitureRenderer.getDimensions(),
                this.roomFurnitureItem.id
            );

            if(!furnitureAtPosition || furnitureAtPosition.data.furniture.flags.stackable) {
                if(entity.position.direction !== undefined) {
                    this.roomFurnitureItem.furnitureRenderer.direction = entity.position.direction;
                }

                this.roomFurnitureItem.setPosition({
                    row: entity.position.row,
                    column: entity.position.column,
                    depth: (furnitureAtPosition)?(furnitureAtPosition.data.position.depth + furnitureAtPosition.data.furniture.dimensions.depth + 0.000000001):(entity.position.depth)
                });

                this.roomFurnitureItem.disabled = false;
                this.iconElement.style.display = "none";

                return;
            }
        }

        this.roomFurnitureItem.disabled = true;

        if(this.roomInstance.roomRenderer.camera.mousePosition) {
            this.iconElement.style.display = "block";
            this.iconElement.style.left = `${Math.round(this.roomInstance.roomRenderer.camera.mousePosition.left)}px`;
            this.iconElement.style.top = `${Math.round(this.roomInstance.roomRenderer.camera.mousePosition.top)}px`;
        }
    }

    private click() {
        if(this.paused) {
            return;
        }

        const entity = this.roomInstance.roomRenderer.getItemAtPosition((item) => item.type === this.roomFurnitureItem.furnitureRenderer.placement);

        if(!entity || !this.roomFurnitureItem.position) {
            if(this.originalPosition) {
               this.roomFurnitureItem.position = this.originalPosition;
            }

            this.onCancel?.();
        }
        else {
            this.onPlace?.(this.roomFurnitureItem.position, this.roomFurnitureItem.furnitureRenderer.direction!);
        }

        this.stopPlacing();
    }

    public startPlacing(onPlace: (position: RoomPosition, direction: number) => void, onCancel: () => void) {
        if(this.roomFurnitureItem.furnitureRenderer.type === "wallpaper" || this.roomFurnitureItem.furnitureRenderer.type === "floor") {
            return;
        }
        
        this.onPlace = onPlace;
        this.onCancel = onCancel;

        this.paused = false;
    }

    public stopPlacing() {
        this.paused = true;

        delete this.onPlace;
        delete this.onCancel;
    }

    public destroy() {
        if(this.roomInstance.roomRenderer.cursor) {
            this.roomInstance.roomRenderer.cursor.cursorDisabled = false;
        }

        this.iconElement.remove();

        this.roomInstance.roomRenderer.removeEventListener("render", this.renderListener);
        this.roomInstance.roomRenderer.element.removeEventListener("click", this.clickListener);

        if(this.temporaryFurniture) {
            const index = this.roomInstance.roomRenderer.items.indexOf(this.roomFurnitureItem);

            if(index !== -1) {
                this.roomInstance.roomRenderer.items.splice(index, 1);
            }
        }
        else {
            this.roomFurnitureItem.alpha = 1;
            this.roomFurnitureItem.disabled = false;
        }
    }
}
