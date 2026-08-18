import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default class Directions {
    public static normalizeDirection(direction: number) {
        while(direction < 0) {
            direction += 8;
        }

        return direction % 8;
    }

    public static getDirectionFromPositions(startPosition: RoomPositionOffsetData, targetPosition: RoomPositionOffsetData) {
        const relativePosition: RoomPositionOffsetData = RoomPositionOffsetData.create({
            row: targetPosition.row - startPosition.row,
            column: targetPosition.column - startPosition.column,
        });

        return this.getDirectionFromRelativePosition(relativePosition);
    }

    public static getDirectionFromRelativePosition(relativePosition: RoomPositionOffsetData): number {
        if(relativePosition.row > 0) {
            relativePosition.row = 1;
        }

        if(relativePosition.row < 0) {
            relativePosition.row = -1;
        }

        if(relativePosition.column > 0) {
            relativePosition.column = 1;
        }

        if(relativePosition.column < 0) {
            relativePosition.column = -1;
        }

        switch(`${relativePosition.row}x${relativePosition.column}`) {
            case "-1x0":
                return 0;

            case "-1x1":
                return 1;

            case "0x1":
                return 2;

            case "1x1":
                return 3;

            case "1x0":
                return 4;

            case "1x-1":
                return 5;

            case "0x-1":
                return 6;

            case "-1x-1":
                return 7;
        }

        return 0;
    }

    public static getPositionFromOffset(offset: number, position: RoomPositionData, direction: number | null): RoomPositionOffsetData {
        const destination = RoomPositionOffsetData.fromJSON(position);

        if(direction === null) {
            return destination;
        }

        switch(Directions.normalizeDirection(direction)) {
            case 0:
                destination.row -= offset;
                break;

            case 1:
                destination.row -= offset;
                destination.column += offset;
                break;

            case 2:
                destination.column += offset;
                break;

            case 3:
                destination.row += offset;
                destination.column += offset;
                break;
            
            case 4:
                destination.row += offset;
                break;

            case 5:
                destination.row += offset;
                destination.column -= offset;
                break;
            
            case 6:
                destination.column -= offset;
                break;

            case 7:
                destination.row -= offset;
                destination.column -= offset;
                break;
        }

        return destination;
    }
}
