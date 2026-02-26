import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomInstance from "@Client/Room/RoomInstance";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import Figure from "@Client/Figure/Figure";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";

export default class RoomFurniturePlacer {
    private paused: boolean = true;

    private onPlace?: (position: RoomPosition, direction: number) => void;
    private onCancel?: () => void;

    private readonly renderListener = this.render.bind(this);
    private readonly clickListener = this.click.bind(this);
    private readonly scrollListener = this.scroll.bind(this);

    private readonly iconElement: HTMLCanvasElement;

    private readonly originalPosition?: RoomPosition;
    private readonly originalDirection?: number;

    public static fromFurnitureData(roomInstance: RoomInstance, furnitureData: FurnitureData) {
        const roomFurnitureItem = new RoomFurnitureItem(
            roomInstance.roomRenderer,
            new Furniture(furnitureData.type, 64, undefined, 0, furnitureData.color)
        );

        return new RoomFurniturePlacer(roomInstance, roomFurnitureItem, true);
    }

    public static fromFigureConfiguration(roomInstance: RoomInstance, figureConfiguration: FigureConfiguration) {
        const roomFurnitureItem = new RoomFigureItem(
            roomInstance.roomRenderer,
            new Figure(figureConfiguration, 2),
            null
        );

        roomFurnitureItem.type = "bot";

        return new RoomFurniturePlacer(roomInstance, roomFurnitureItem, true);
    }

    constructor(private readonly roomInstance: RoomInstance, private readonly roomFurnitureItem: RoomItem, private readonly temporaryFurniture: boolean = false) {
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

        if((roomFurnitureItem instanceof RoomFurnitureItem) && roomFurnitureItem.furnitureRenderer.direction) {
            this.originalDirection = roomFurnitureItem.furnitureRenderer.direction;
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
        document.addEventListener("wheel", this.scrollListener);

        this.iconElement = document.createElement("canvas");
        this.iconElement.style.display = "none";
        this.iconElement.style.position = "fixed";
        this.iconElement.style.pointerEvents = "none";
        this.iconElement.style.transform = "translate(-50%, -50%)";

        if(this.roomFurnitureItem instanceof RoomFurnitureItem) {
            new Furniture(this.roomFurnitureItem.furnitureRenderer.type, 1, 0, 0, this.roomFurnitureItem.furnitureRenderer.color).renderToCanvas().then((image) => {
                this.iconElement.width = image.width;
                this.iconElement.height = image.height;

                const context = this.iconElement.getContext("2d");

                if(!context) {
                    throw new ContextNotAvailableError();
                }

                context.drawImage(image, 0, 0);
            });
        }
        else if(this.roomFurnitureItem instanceof RoomFigureItem) {
            new Figure(this.roomFurnitureItem.figureRenderer.configuration, 3, undefined, true).renderToCanvas(Figure.figureWorker, 0, true).then((result) => {
                this.iconElement.width = result.figure.image.width;
                this.iconElement.height = result.figure.image.height;

                const context = this.iconElement.getContext("2d");

                if(!context) {
                    throw new ContextNotAvailableError();
                }

                context.drawImage(result.figure.image, 0, 0);
            })
        }

        
        this.roomInstance.roomRenderer.parent.appendChild(this.iconElement);
    }

    private scroll(event: WheelEvent) {
        if(this.paused) {
            return;
        }

        if((this.roomFurnitureItem instanceof RoomFurnitureItem)) {
            if(this.roomFurnitureItem.furnitureRenderer.placement !== "floor") {
                return;
            }

            if(event.deltaY < 0) {
                const nextDirection = this.roomFurnitureItem.furnitureRenderer.getNextDirection();

                if(this.roomFurnitureItem.furnitureRenderer.direction !== nextDirection) {
                    this.roomFurnitureItem.furnitureRenderer.direction = nextDirection;
                }
            }
        }
        else if((this.roomFurnitureItem instanceof RoomFigureItem)) {
            if(event.deltaY < 0) {
                const nextDirection = (this.roomFurnitureItem.figureRenderer.direction + 1) % 8;

                if(this.roomFurnitureItem.figureRenderer.direction !== nextDirection) {
                    this.roomFurnitureItem.figureRenderer.direction = nextDirection;
                }
            }
        }
    }

    private render() {
        if(this.paused) {
            return;
        }

        const isFurniture = this.roomFurnitureItem instanceof RoomFurnitureItem;

        const isFloorPlacement = (
            (isFurniture)?(
                this.roomFurnitureItem.furnitureRenderer.placement === "floor"
            ):(
                true
            )
        );

        const entity = this.roomInstance.roomRenderer.getItemAtPosition((item) => item.type === "floor" && isFloorPlacement);

        if(entity?.position) {
            const dimensions = (
                (isFurniture)?(
                    this.roomFurnitureItem.furnitureRenderer.getDimensions()
                ):(
                    {
                        row: 1,
                        column: 1,
                        depth: 1
                    }
                )
            );

            const isPositionInsideStructure = (!isFloorPlacement || (entity && this.roomInstance.roomRenderer.isPositionInsideStructure(entity.position, dimensions)));
            const isPositionInsideFigure = (isFloorPlacement && (entity && this.roomInstance.roomRenderer.isPositionInsideFigure(entity.position, dimensions, this.roomFurnitureItem)));

            if(entity && isPositionInsideStructure && !isPositionInsideFigure) {
                const furnitureAtPosition = (isFloorPlacement) && this.roomInstance.getFurnitureAtUpmostPosition(
                    {
                        row: entity.position.row,
                        column: entity.position.column
                    },
                    dimensions,
                    (isFurniture)?(this.roomFurnitureItem.id):(undefined)
                );

                if(!furnitureAtPosition || furnitureAtPosition.data.furniture.flags.stackable) {
                    if(isFurniture && entity.position.direction !== undefined) {
                        this.roomFurnitureItem.furnitureRenderer.direction = entity.position.direction;
                    }

                    this.roomFurnitureItem.setPosition({
                        row: entity.position.row,
                        column: entity.position.column,
                        depth: (furnitureAtPosition)?(furnitureAtPosition.data.position.depth + furnitureAtPosition.getDimensionDepth() + 0.0001):(entity.position.depth)
                    });

                    this.roomFurnitureItem.disabled = false;
                    this.iconElement.style.display = "none";

                    return;
                }
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

        const isFurniture = this.roomFurnitureItem instanceof RoomFurnitureItem;

        const isFloorPlacement = (
            (isFurniture)?(
                this.roomFurnitureItem.furnitureRenderer.placement === "floor"
            ):(
                true
            )
        );

        const entity = this.roomInstance.roomRenderer.getItemAtPosition((item) => item.type === "floor" && isFloorPlacement);
        
        const dimensions = (
            (isFurniture)?(
                this.roomFurnitureItem.furnitureRenderer.getDimensions()
            ):(
                {
                    row: 1,
                    column: 1,
                    depth: 1
                }
            )
        );
        
        const furnitureAtPosition = (entity?.position && isFloorPlacement) && this.roomInstance.getFurnitureAtUpmostPosition(
            {
                row: entity.position.row,
                column: entity.position.column
            },
            dimensions,
            (isFurniture)?(this.roomFurnitureItem.id):(undefined)
        );

        const position = (entity?.position)?({
            row: entity.position.row,
            column: entity.position.column,
            depth: (furnitureAtPosition)?(furnitureAtPosition.data.position.depth + furnitureAtPosition.getDimensionDepth() + 0.0001):(entity.position.depth)
        }):(null);

        if(!entity || !position || this.roomFurnitureItem.disabled) {
            if(this.originalPosition) {
               this.roomFurnitureItem.position = this.originalPosition;
            }

            if(this.originalDirection && isFurniture) {
               this.roomFurnitureItem.furnitureRenderer.direction = this.originalDirection;
            }

            this.onCancel?.();
        }
        else {
            if(isFurniture) {
                this.onPlace?.(position, this.roomFurnitureItem.furnitureRenderer.direction!);
            }
            else if(this.roomFurnitureItem instanceof RoomFigureItem) {
                this.onPlace?.(position, this.roomFurnitureItem.figureRenderer.direction!);
            }
        }

        this.stopPlacing();
    }

    public startPlacing(onPlace: (position: RoomPosition, direction: number) => void, onCancel: () => void) {
        if(this.roomFurnitureItem instanceof RoomFurnitureItem && (this.roomFurnitureItem.furnitureRenderer.type === "wallpaper" || this.roomFurnitureItem.furnitureRenderer.type === "floor")) {
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
        document.removeEventListener("wheel", this.scrollListener);

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
