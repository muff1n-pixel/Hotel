import { initializeModels } from "../Database/Database";
import RoomServer from "./Server/RoomServer";

export let roomServer: RoomServer;

initializeModels().then(async () => {
    roomServer = new RoomServer();

    await roomServer.hotelSettings.loadModels();

    console.log("Room server started");
});
