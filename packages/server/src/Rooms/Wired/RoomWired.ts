import { randomUUID } from "crypto";
import Room from "../Room";
import RoomWiredExecution from "./Interfaces/RoomWiredExecution";
import RoomWiredLog from "./Interfaces/RoomWiredLog";
import RoomWiredLogGroup from "./Interfaces/RoomWiredLogGroup";
import { RoomWiredLogLevel } from "./Interfaces/RoomWiredLogLevel";
import { game } from "../..";

export default class RoomWired {
    public logs: RoomWiredLog[] = [];
    public executions: RoomWiredExecution[] = [];

    constructor(private readonly room: Room) {

    }

    public addLog(level: RoomWiredLogLevel, category: string, message: string) {
        this.logs.push({
            level,
            category,
            message,
            timestamp: new Date().toISOString()
        });

        if(this.logs.length > 200) {
            this.logs.shift();
        }
    }

    public startExecution<T>(promise: Promise<T>) {
        if(this.executions.length >= game.hotelSettings.roomWiredMaxUsage) {
            this.addLog("ERROR", "EXECUTION_CAP", `Execution cap of ${game.hotelSettings.roomWiredMaxUsage} has exceeded.`);
            
            return;
        }

        const abortController = new AbortController();

        const execution: RoomWiredExecution = {
            id: randomUUID(),
            startTimestamp: new Date().toISOString(),
            abortController
        };

        this.executions.push(execution);

        const timeout: NodeJS.Timeout = setTimeout(() => {
            abortController.abort();

            this.addLog("ERROR", "EXECUTION_TIMED_OUT", `Execution ${execution.id} took more than 2 seconds to execute.`);
        }, 2 * 1000);

        return Promise.race([
            promise,
            new Promise((_, reject) => {
                abortController.signal.addEventListener("abort", reject, { once: true });
            }),
        ])
        .then(() => {
            clearTimeout(timeout);

            this.finishExecution(execution);
        })
        .catch(() => {
            clearTimeout(timeout);

            this.finishExecution(execution);
        });
    }

    public abortExecution(execution: RoomWiredExecution, reason?: string) {
        if(!execution.abortController.signal.aborted) {
            execution.abortController.abort(reason);
        }

        this.finishExecution(execution);
    }

    public finishExecution(execution: RoomWiredExecution) {
        const index = this.executions.findIndex((_execution) => _execution.id === execution.id);

        if(index !== -1) {
            this.executions.splice(index, 1);
        }
    }

    public getLogCategories() {
        const grouped = new Map<string, RoomWiredLogGroup>();

        for(const log of this.logs) {
            if(log.level === "INFO") {
                continue;
            }

            const existing = grouped.get(log.category);

            if(existing) {
                existing.amount++;

                if(log.timestamp > existing.latestTimestamp) {
                    existing.latestTimestamp = log.timestamp;
                }
            } else {
                grouped.set(log.category, {
                    level: log.level,
                    category: log.category,
                    amount: 1,
                    latestTimestamp: log.timestamp
                });
            }
        }

        return Array.from(grouped.values());
    }
}
