import ObservableRequiredProperty from "@Client/Utilities/ObservableRequiredProperty";
import { UserFurnitureNotificationData } from "@pixel63/events";

export default class UserNotifications {
    public userFurnitureNotifications = new ObservableRequiredProperty<UserFurnitureNotificationData[]>([]);
}
