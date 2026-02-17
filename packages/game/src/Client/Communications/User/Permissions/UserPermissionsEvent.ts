import IncomingEvent from "@Client/Communications/IncomingEvent";
import { UserPermissionsEventData } from "@Shared/Communications/Responses/User/Permissions/UserPermissionsEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { clientInstance } from "../../../..";

export default class UserPermissionsEvent implements IncomingEvent<WebSocketEvent<UserPermissionsEventData>> {
    async handle(event: WebSocketEvent<UserPermissionsEventData>) {
        clientInstance.permissions.value = event.data;
    }
}
