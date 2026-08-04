import { RoomMapModel } from "../../Database/Models/Rooms/Maps/RoomMapModel.js";
import { RoomCategoryModel } from "../../Database/Models/Rooms/Categories/RoomCategoryModel.js";

export default class RoomNavigatorManager {
    public maps: RoomMapModel[] = [];
    public categories: RoomCategoryModel[] = [];

    constructor() {
    }

    public async loadModels() {
        this.maps = await RoomMapModel.findAll({
            where: {
                indexable: true
            },
            order: [
                ["index", "ASC"]
            ]
        });

        this.categories = await RoomCategoryModel.findAll({
            order: [
                ["title", "ASC"]
            ]
        });
    }
}
