import { initializeModels } from "../Database/Database";
import { logger } from "./RoomLogger";
import RoomServer from "./RoomServer";

initializeModels().then(async () => {
    await RoomServer.start();
});
