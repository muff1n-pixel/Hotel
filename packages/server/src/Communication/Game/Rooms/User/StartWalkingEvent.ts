import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { StartWalkingEventData } from "@shared/Communications/Requests/Rooms/User/StartWalkingEventData.js";
import { AStarFinder } from "astar-typescript";

export default class StartWalkingEvent implements IncomingEvent<StartWalkingEventData> {
    async handle(user: User, event: StartWalkingEventData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        console.log(user.model.name + ": start walking from " + JSON.stringify(roomUser.position));
        console.log(user.model.name + ": start walking to " + JSON.stringify(event.target));

        const rows = user.room.model.structure.grid.map((row, rowIndex) => {
            return row.split('').map((column, columnIndex) => {
                if(column === 'X') {
                    return 1;
                }

                const furniture = user.room!.getUpmostFurnitureAtPosition({ row: rowIndex, column: columnIndex });

                if(furniture) {
                    if(!furniture.model.furniture.flags.walkable) {
                        return 1;
                    }
                }

                return 0;
            });
        });

        const columns = rows[0]!.map((_, colIndex) => rows.map(row => row[colIndex]!));

        const astarFinder = new AStarFinder({
            grid: {
                matrix: columns
            }
        });

        const result = astarFinder.findPath({
            x: roomUser.position.row,
            y: roomUser.position.column,
        }, {
            x: event.target.row,
            y: event.target.column,
        });

        const path = result.map((position) => {
            return {
                row: position[0]!,
                column: position[1]!
            }
        });

        path.splice(0, 1);

        roomUser.path = path;

        console.log("Result: " + JSON.stringify(path));

        user.room.requestActionsFrame();
    }
}
