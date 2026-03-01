import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { HotelData } from "@pixel63/events";

export default class HotelEvent implements ProtobuffListener<HotelData> {
    async handle(payload: HotelData) {
        clientInstance.hotel.value = payload;
    }
}
