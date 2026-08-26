import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomInstance from "@Client/Room/RoomInstance";
import Figure from "@Client/Figure/Figure";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { FigureConfigurationData, FurnitureData, PetData, RoomPositionData, RoomPositionWithDirectionData, UserFurnitureData } from "@pixel63/events";
import Pet from "@Client/Pets/Pet";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import RoomFurnitureStackHelperLogic from "@Client/Room/Furniture/Logic/RoomFurnitureStackHelperLogic";
import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";
import RoomFurnitureSprite from "@Client/Room/Items/Furniture/RoomFurnitureSprite";

export default class RoomFurniturePlacer {
    private paused: boolean = true;

    private onPlace?: (position: RoomPositionData, direction: number) => void;
    private onCancel?: () => void;

    private readonly renderListener = this.render.bind(this);
    private readonly clickListener = this.click.bind(this);
    private readonly scrollListener = this.scroll.bind(this);

    private readonly iconElement: HTMLCanvasElement;

    private readonly originalPosition?: RoomPositionData;
    private readonly originalDirection?: number;

    public static fromFurnitureData(roomInstance: RoomInstance, furnitureData: FurnitureData, userFurnitureData?: UserFurnitureData) {
        const roomFurnitureItem = new RoomFurnitureItem(
            roomInstance.roomRenderer,
            new Furniture(furnitureData.type, 64, undefined, 0, furnitureData.color)
        );

        roomFurnitureItem.furnitureRenderer.figureConfiguration = userFurnitureData?.data?.mannequin?.figureConfiguration;
        roomFurnitureItem.furnitureRenderer.externalImage = userFurnitureData?.data?.externalImage?.externalImage;
        roomFurnitureItem.furnitureRenderer.colorTags = userFurnitureData?.colorTags;

        return new RoomFurniturePlacer(roomInstance, roomFurnitureItem, true);
    }

    public static fromPetData(roomInstance: RoomInstance, petData: PetData) {
        const roomFurnitureItem = new RoomPetItem(
            roomInstance.roomRenderer,
            new Pet(petData.type, petData.palettes)
        );

        return new RoomFurniturePlacer(roomInstance, roomFurnitureItem, true);
    }

    public static fromFigureConfiguration(roomInstance: RoomInstance, figureConfiguration: FigureConfigurationData) {
        const roomFurnitureItem = new RoomFigureItem(
            roomInstance.roomRenderer,
            new Figure(figureConfiguration, 2),
            undefined
        );

        roomFurnitureItem.type = "bot";

        return new RoomFurniturePlacer(roomInstance, roomFurnitureItem, true);
    }

    constructor(private readonly roomInstance: RoomInstance, private readonly roomFurnitureItem: RoomItem, private readonly temporaryFurniture: boolean = false) {
        if(this.roomInstance.roomRenderer.furniturePlacer) {
            this.roomInstance.roomRenderer.furniturePlacer.destroy();
        }

        this.roomInstance.roomRenderer.furniturePlacer = this;

        if(roomFurnitureItem.position) {
            this.originalPosition = RoomPositionData.create({
                row: roomFurnitureItem.position.row,
                column: roomFurnitureItem.position.column,
                depth: roomFurnitureItem.position.depth
            });
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

        this.roomInstance.roomRenderer.entityManager.addEntity(this.roomFurnitureItem);

        this.roomInstance.roomRenderer.addEventListener("render", this.renderListener);
        this.roomInstance.roomRenderer.application.canvas.addEventListener("click", this.clickListener);
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
        else if(this.roomFurnitureItem instanceof RoomPetItem) {
            new Pet(this.roomFurnitureItem.pet.type, this.roomFurnitureItem.pet.palettes, undefined, true).renderToCanvas().then((image) => {
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
            const figure = new Figure(this.roomFurnitureItem.figureRenderer.configuration, 3, undefined, true);

            figure.loadAssets(0).then(() => {
                const result = figure.renderToCanvas(0, true);

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
            else {
                const previousDirection = this.roomFurnitureItem.furnitureRenderer.getPreviousDirection();

                if(this.roomFurnitureItem.furnitureRenderer.direction !== previousDirection) {
                    this.roomFurnitureItem.furnitureRenderer.direction = previousDirection;
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

        const placement = (isFloorPlacement)?("floor"):("wall");

        const entity = this.roomInstance.roomRenderer.hitTester.getEntityAtMousePosition((item) => item.type === placement);
        const position = this.getPlacementPosition(entity, placement);

        if(entity?.position && position) {
            let dimensions = (
                (isFurniture)?(
                    this.roomFurnitureItem.furnitureRenderer.getDimensions()
                ):(
                    RoomPositionData.create({
                        row: 1,
                        column: 1,
                        depth: 1
                    })
                )
            );

            let isPositionInsideStructure = (!isFloorPlacement || (entity && this.roomInstance.roomRenderer.structure.isPositionInsideStructure(RoomPositionData.fromJSON(position), dimensions)));

            if(isFurniture && isFloorPlacement && !isPositionInsideStructure) {
                const nextDirection = this.roomFurnitureItem.furnitureRenderer.getNextDirection();

                if(nextDirection !== this.roomFurnitureItem.furnitureRenderer.direction) {
                    const rotatedDimensions = this.roomFurnitureItem.furnitureRenderer.getDimensionsForDirection(nextDirection);

                    if(this.roomInstance.roomRenderer.structure.isPositionInsideStructure(RoomPositionData.fromJSON(position), rotatedDimensions)) {
                        dimensions = rotatedDimensions;
                        isPositionInsideStructure = true;

                        this.roomFurnitureItem.furnitureRenderer.direction = nextDirection;
                    }
                }
            }

            const isPositionInsideFigure = (isFloorPlacement && (entity && this.roomInstance.roomRenderer.entityManager.isPositionInsideFigure(RoomPositionData.fromJSON(position), dimensions, this.roomFurnitureItem)));

            const furnitureAtPosition = (isFloorPlacement)?(this.roomInstance.getFurnitureAtUpmostPosition(
                    RoomPositionData.create({
                        row: position.row,
                        column: position.column
                    }),
                    dimensions,
                    (isFurniture)?(this.roomFurnitureItem.id):(undefined)
                )):(undefined);

            if(entity && isPositionInsideStructure && (furnitureAtPosition?.getLogic() instanceof RoomFurnitureStackHelperLogic || !isPositionInsideFigure)) {
                if(!furnitureAtPosition || furnitureAtPosition.furnitureData.flags?.stackable) {
                    if(isFurniture && position.direction !== undefined) {
                        this.roomFurnitureItem.furnitureRenderer.direction = position.direction;
                    }

                    this.roomFurnitureItem.setPosition(RoomPositionData.create({
                        row: position.row,
                        column: position.column,
                        depth: (furnitureAtPosition && furnitureAtPosition.item.position)?(furnitureAtPosition.item.position.depth + furnitureAtPosition.getDimensionDepth() + 0.0001):(position.depth)
                    }));

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

    private getPlacementPosition(entity: RoomPointerPosition | null, placement: "wall" | "floor"): RoomPositionWithDirectionData | null {
        if(!entity?.position) {
            return null;
        }

        if(placement === "floor") {
            if(this.roomInstance.roomRenderer.entityManager.wallItem?.wallRenderer.hasDoorWall && entity.position.row === this.roomInstance.roomRenderer.structure.data.door?.row && entity.position.column === this.roomInstance.roomRenderer.structure.data.door?.column) {
                return null;
            }
            
            return entity.position;
        }

        if(this.roomInstance.roomRenderer.cursor?.shiftKey) {
            const sprite: RoomFurnitureSprite | undefined = this.roomFurnitureItem.sprites.find<RoomFurnitureSprite>((sprite) => sprite instanceof RoomFurnitureSprite);

            if(sprite) {
                const filteredWallFurniture = this.roomInstance.roomRenderer.entityManager.entities.filter((item) => item.id !== this.roomFurnitureItem.id && item instanceof RoomFurnitureItem && item.furnitureRenderer.placement === "wall" && item.furnitureRenderer.direction === entity.position?.direction);

                function getSquaredDistance(item: RoomItem) {
                    const dr = item.position!.row - entity!.position!.row;
                    const dc = item.position!.column - entity!.position!.column;
                    const dd = item.position!.depth - entity!.position!.depth;

                    return dr * dr + dc * dc + dd * dd;
                };

                const closestWallFurniture: RoomFurnitureItem | null = (filteredWallFurniture as RoomFurnitureItem[]).reduce((previousValue: RoomFurnitureItem | null, current: RoomFurnitureItem) => {
                    if(!previousValue) {
                        return current;
                    }

                    return getSquaredDistance(current) < getSquaredDistance(previousValue) ? current : previousValue;
                }, null);

                if(closestWallFurniture && getSquaredDistance(closestWallFurniture) < 2) {
                    const closestWallFurnitureDimensions = closestWallFurniture.getDimensions();

                    const snapDistance = 1;

                    let row = closestWallFurniture.position!.row;

                    if(closestWallFurniture.furnitureRenderer.direction === 2) {
                        const leftRow = closestWallFurniture.position!.row - closestWallFurnitureDimensions.row;
                        const rightRow = closestWallFurniture.position!.row + closestWallFurnitureDimensions.row;

                        const middleRow = closestWallFurniture.position!.row;

                        const snappedRow =
                            Math.abs(entity.position!.row - leftRow) < Math.abs(entity.position!.row - rightRow)
                                ? leftRow
                                : rightRow;

                        row = Math.abs(entity.position!.row - snappedRow) <= snapDistance
                            ? snappedRow
                            : middleRow;
                    }

                    let column = closestWallFurniture.position!.column;

                    if(closestWallFurniture.furnitureRenderer.direction === 4) {
                        const leftColumn = closestWallFurniture.position!.column - closestWallFurnitureDimensions.column;
                        const rightColumn = closestWallFurniture.position!.column + closestWallFurnitureDimensions.column;

                        const middleColumn = closestWallFurniture.position!.column;

                        const snappedColumn =
                            Math.abs(entity.position!.column - leftColumn) < Math.abs(entity.position!.column - rightColumn)
                                ? leftColumn
                                : rightColumn;

                        column = Math.abs(entity.position!.column - snappedColumn) <= snapDistance
                            ? snappedColumn
                            : middleColumn;
                    }

                    const frontDepth = closestWallFurniture.position!.depth - closestWallFurnitureDimensions.depth;
                    const backDepth = closestWallFurniture.position!.depth + closestWallFurnitureDimensions.depth;

                    const middleDepth = closestWallFurniture.position!.depth;

                    const snappedDepth =
                        Math.abs(entity.position!.depth - frontDepth) < Math.abs(entity.position!.depth - backDepth)
                            ? frontDepth
                            : backDepth;

                    return RoomPositionWithDirectionData.create({
                        row,
                        column,

                        depth: Math.abs(entity.position!.depth - snappedDepth) <= snapDistance
                            ? snappedDepth
                            : middleDepth,

                        direction: closestWallFurniture.furnitureRenderer.direction
                    });
                }
            }
            
        }

        return entity.position;
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

        const placement = (isFloorPlacement)?("floor"):("wall");

        const entity = this.roomInstance.roomRenderer.hitTester.getEntityAtMousePosition((item) => item.type === placement);
        const placementPosition = this.getPlacementPosition(entity, placement);

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
        
        const furnitureAtPosition = (placementPosition && isFloorPlacement) && this.roomInstance.getFurnitureAtUpmostPosition(
            RoomPositionData.create({
                row: placementPosition.row,
                column: placementPosition.column
            }),
            RoomPositionData.create(dimensions),
            (isFurniture)?(this.roomFurnitureItem.id):(undefined)
        );

        const position = (placementPosition)?(RoomPositionData.create({
            row: placementPosition.row,
            column: placementPosition.column,
            depth: (furnitureAtPosition && furnitureAtPosition.item.position)?(furnitureAtPosition.item.position.depth + furnitureAtPosition.getDimensionDepth() + 0.0001):(placementPosition.depth)
        })):(null);

        if(!entity || !position || this.roomFurnitureItem.disabled) {
            if(this.originalPosition) {
               this.roomFurnitureItem.setPosition(this.originalPosition);
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
            else if(this.roomFurnitureItem instanceof RoomPetItem) {
                this.onPlace?.(position, this.roomFurnitureItem.pet.direction!);
            }
        }

        this.stopPlacing();
    }

    public startPlacing(onPlace: (position: RoomPositionData, direction: number) => void, onCancel: () => void) {
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
        this.roomInstance.roomRenderer.furniturePlacer = undefined;

        if(this.roomInstance.roomRenderer.cursor) {
            this.roomInstance.roomRenderer.cursor.cursorDisabled = false;
        }

        this.iconElement.remove();

        this.roomInstance.roomRenderer.removeEventListener("render", this.renderListener);
        this.roomInstance.roomRenderer.application.canvas.removeEventListener("click", this.clickListener);
        document.removeEventListener("wheel", this.scrollListener);

        if(this.temporaryFurniture) {
            this.roomInstance.roomRenderer.entityManager.removeEntity(this.roomFurnitureItem);
        }
        else {
            this.roomFurnitureItem.alpha = 1;
            this.roomFurnitureItem.disabled = false;
        }
    }
}
