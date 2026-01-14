import { Model, NonAttribute } from "sequelize";
import { ShopPageFurniture } from "./ShopPageFurniture";

export class ShopPage extends Model {
    declare id: string;
    declare title: string;
    declare icon: string | null;
    declare category: "frontpage" | "furniture" | "clothing" | "pets";
    declare type: "default";
    
    declare children: NonAttribute<ShopPage[]>;
    declare furniture: NonAttribute<ShopPageFurniture[]>;
}
