import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { NavigatorData } from "@pixel63/events";

export default class NavigatorEvent implements ProtobuffListener<NavigatorData> {
    async handle(payload: NavigatorData) {
        clientInstance.navigator.value = payload.categories;
    }
}
