import ObservableRequiredProperty from "@Client/Utilities/ObservableRequiredProperty";

export default class UserNotifications {
    public userFurnitureNotifications = new ObservableRequiredProperty<string[]>([]);
    public userPetNotifications = new ObservableRequiredProperty<string[]>([]);
    public userBotNotifications = new ObservableRequiredProperty<string[]>([]);
}
