import { RoomPositionData } from "@pixel63/events";
import RoomRenderer from "./RoomRenderer";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItem from "../Items/RoomItem";
import RoomFigureItem from "../Items/Figure/RoomFigureItem";
import RoomFigureSprite from "../Items/Figure/RoomFigureSprite";
import RoomPetItem from "../Items/Pets/RoomPetItem";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomFurnitureSprite from "../Items/Furniture/RoomFurnitureSprite";

export default class RoomCoordinateMapper {
    constructor(private readonly renderer: RoomRenderer) {

    }
    
    public getCoordinatePosition(coordinate?: RoomPositionData): MousePosition {
        if(!coordinate) {
            return {
                left: 0,
                top: 0
            };
        }

        return RoomCoordinateMapper.getCoordinatePosition(coordinate, 1 /*this.getSizeScale()*/);
    }
    
    public static getCoordinatePosition(coordinate: RoomPositionData, scale: number) {
        const result = {
            left: Math.round(-(coordinate.row * 32) + (coordinate.column * 32) - 64),
            top: Math.round((coordinate.column * 16) + (coordinate.row * 16) - ((Math.round(coordinate.depth * 1000) / 1000) * 32))
        };

        result.left *= scale;
        result.top *= scale;

        return result;
    }
    
    public getItemScreenPosition(item: RoomItem): MousePosition {
        if(!item.position) {
            return {
                left: (this.renderer.camera.cameraPosition.left * this.renderer.scale.value),
                top: (this.renderer.camera.cameraPosition.top * this.renderer.scale.value)
            };
        }

        const translatePosition = RoomCoordinateMapper.getCoordinatePosition(item.position, this.renderer.scale.value);

        if(item instanceof RoomFigureItem) {
            const figureSprite = item.sprites.find<RoomFigureSprite>((sprite) => sprite instanceof RoomFigureSprite);

            if(figureSprite) {
                translatePosition.top += figureSprite.offset.top + 128;

                if(figureSprite.item.figureRenderer.hasAction("Sit")) {
                    translatePosition.top += 16;
                }
            }
        }
        else if(item instanceof RoomPetItem) {
            translatePosition.top -= 16;
        }
        else if(item instanceof RoomFurnitureItem) {
            const furnitureSprites = item.sprites.filter((sprite) => sprite instanceof RoomFurnitureSprite);

            if(furnitureSprites.length) {
                const minOffset = Math.max(...furnitureSprites.map(({ furnitureSprite: sprite }) => sprite.y), 0);

                translatePosition.top += minOffset;
                translatePosition.top -= 24;
            }
        }

        return {
            left: (this.renderer.camera.cameraPosition.left + (translatePosition.left)),
            top: (this.renderer.camera.cameraPosition.top + (translatePosition.top))
        };
    }
}
