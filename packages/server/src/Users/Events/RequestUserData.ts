import UserClient from "../../Clients/UserClient.js";
import { eventHandler } from "../../Events/EventHandler.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { UserDataUpdated } from "@shared/WebSocket/Events/User/UserDataUpdated.js";

eventHandler.addListener("RequestUserData", async (client: UserClient) => {
    client.send(new OutgoingEvent<UserDataUpdated>("UserDataUpdated", {
        id: client.user.id,
        name: client.user.name,
        figureConfiguration: client.user.figureConfiguration
    }));
});
