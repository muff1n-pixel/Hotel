import FurnitureRenderer from "@Client/Furniture/FurnitureRenderer";
import RoomRenderer from "./Renderer";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { UserFurnitureData } from "@Shared/Interfaces/User/UserFurnitureData";

export default class RoomFurniturePlacer {
    private readonly furnitureItem: RoomFurnitureItem;
    private readonly furnitureRenderer: FurnitureRenderer;

    private paused: boolean = true;

    private onPlace?: (position: RoomPosition) => void;
    private onCancel?: () => void;

    private readonly renderListener = this.render.bind(this);
    private readonly clickListener = this.click.bind(this);

    private readonly iconElement: HTMLCanvasElement;

    constructor(private readonly roomRenderer: RoomRenderer, public readonly userFurnitureData: UserFurnitureData) {
        if(this.roomRenderer.furniturePlacer) {
            this.roomRenderer.furniturePlacer.destroy();
        }

        this.furnitureRenderer = new FurnitureRenderer(userFurnitureData.furnitureData.type, 64, undefined, 0, userFurnitureData.furnitureData.color);

        this.furnitureItem = new RoomFurnitureItem(this.furnitureRenderer, {
            row: 0,
            column: 0,
            depth: 0
        });

        this.furnitureItem.disabled = true;

        if(this.roomRenderer.cursor) {
            this.roomRenderer.cursor.cursorDisabled = true;
        }

        this.roomRenderer.items.push(this.furnitureItem);

        this.roomRenderer.addEventListener("render", this.renderListener);
        this.roomRenderer.element.addEventListener("click", this.clickListener);

        this.iconElement = document.createElement("canvas");
        this.iconElement.style.display = "none";
        this.iconElement.style.position = "fixed";
        this.iconElement.style.pointerEvents = "none";
        this.iconElement.style.transform = "translate(-50%, -50%)";

        new FurnitureRenderer(userFurnitureData.furnitureData.type, 1, undefined, 0, userFurnitureData.furnitureData.color).renderToCanvas().then((image) => {
            this.iconElement.width = image.width;
            this.iconElement.height = image.height;

            const context = this.iconElement.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.drawImage(image, 0, 0);
        });
        
        this.roomRenderer.parent.appendChild(this.iconElement);
    }

    private render() {
        if(this.paused) {
            return;
        }

        const entity = this.roomRenderer.getItemAtPosition((item) => item.type === "map");

        if(entity) {
            this.furnitureItem.setPosition(entity.position);
            this.furnitureItem.disabled = false;
            this.iconElement.style.display = "none";
        }
        else {
            this.furnitureItem.disabled = true;

            if(this.roomRenderer.camera.mousePosition) {
                this.iconElement.style.display = "block";
                this.iconElement.style.left = `${Math.round(this.roomRenderer.camera.mousePosition.left)}px`;
                this.iconElement.style.top = `${Math.round(this.roomRenderer.camera.mousePosition.top)}px`;
            }
        }
    }

    private click() {
        if(this.paused) {
            return;
        }

        const entity = this.roomRenderer.getItemAtPosition((item) => item.type === "map");

        if(!entity) {
            this.onCancel?.();
        }
        else {
            this.onPlace?.(entity.position);
        }

        this.stopPlacing();
    }

    public startPlacing(onPlace: (position: RoomPosition) => void, onCancel: () => void) {
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
        if(this.roomRenderer.cursor) {
            this.roomRenderer.cursor.cursorDisabled = false;
        }

        this.roomRenderer.parent.removeChild(this.iconElement);

        this.roomRenderer.removeEventListener("render", this.renderListener);
        this.roomRenderer.element.removeEventListener("click", this.clickListener);

        const index = this.roomRenderer.items.indexOf(this.furnitureItem);

        if(index !== -1) {
            this.roomRenderer.items.splice(index, 1);
        }
    }
}
