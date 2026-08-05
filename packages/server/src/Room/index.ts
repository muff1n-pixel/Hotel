import { initializeModels } from "../Database/Database";
import RoomServer from "./Server/RoomServer";

export let roomServer: RoomServer;

initializeModels().then(() => {
    roomServer = new RoomServer();

    console.log("Room server started");
});
