import { initializeModels } from "../Database/Database";
import RoomServer from "./RoomServer";

initializeModels().then(async () => {
    await RoomServer.start();

    console.log("Room server started");
});
