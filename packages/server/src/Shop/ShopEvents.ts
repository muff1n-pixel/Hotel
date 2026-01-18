import { ShopPagesResponse } from "@shared/WebSocket/Events/Shop/ShopPagesResponse.js";
import UserClient from "../Clients/UserClient.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { ShopPageModel } from "../Database/Models/Shop/ShopPageModel.js";
import { ShopPagesRequest } from "@shared/WebSocket/Events/Shop/ShopPagesRequest.js";
import { ShopPageFurnitureRequest } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureRequest.js";
import { ShopPageFurnitureModel } from "../Database/Models/Shop/ShopPageFurnitureModel.js";
import { ShopPageFurnitureResponse } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureResponse.js";
import { FurnitureModel } from "../Database/Models/Furniture/FurnitureModel.js";
import { PurchaseShopFurnitureRequest, PurchaseShopFurnitureResponse } from "@shared/WebSocket/Events/Shop/Furniture/PurchaseShopFurniture.js";

export default class ShopEvents {
    public static async dispatchShopPages(userClient: UserClient, event: ShopPagesRequest) {
        if(event.category !== "furniture") {
            return;
        }

        const shopPages: ShopPageModel[] = await ShopPageModel.findAll({
            where: {
                category: "furniture",
                parentId: null
            },
            include: {
                model: ShopPageModel,
                as: "children"
            }
        });

        userClient.send(new OutgoingEvent<ShopPagesResponse>("ShopPagesResponse", {
            category: "furniture",
            pages: shopPages.map((shopPage) => {
                return {
                    id: shopPage.id,

                    title: shopPage.title,
                    description: shopPage.description,
                    
                    icon: shopPage.icon ?? undefined,
                    header: shopPage.header ?? undefined,
                    
                    type: shopPage.type,
                    
                    children: shopPage.children.map((shopPage) => {
                        return {
                            id: shopPage.id,
                            title: shopPage.title,
                            type: shopPage.type,
                            icon: shopPage.icon ?? undefined,
                        };
                    })
                };
            })
        }));
    }

    public static async dispatchShopPageFurniture(userClient: UserClient, event: ShopPageFurnitureRequest) {
        const shopPage = await ShopPageModel.findByPk(event.pageId, {
            include: {
                model: ShopPageFurnitureModel,
                as: "furniture",
                include: [
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            }
        });

        if(!shopPage) {
            throw new Error("Shop page does not exist.");
        }

        userClient.send(new OutgoingEvent<ShopPageFurnitureResponse>("ShopPageFurnitureResponse", {
            pageId: shopPage.id,
            furniture: shopPage.furniture.map((furniture) => {
                return {
                    id: furniture.id,
                    furniture: furniture.furniture
                }
            })
        }));
    }

    public static async handlePurchaseShopFurniture(userClient: UserClient, event: PurchaseShopFurnitureRequest) {
        const shopFurniture = await ShopPageFurnitureModel.findOne({
            where: {
                id: event.shopFurnitureId
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });

        if(!shopFurniture) {
            userClient.send(new OutgoingEvent<PurchaseShopFurnitureResponse>("PurchaseShopFurnitureResponse", {
                success: false
            }));

            return;
        }

        await userClient.getInventory().addFurniture(shopFurniture.furniture);

        userClient.send(new OutgoingEvent<PurchaseShopFurnitureResponse>("PurchaseShopFurnitureResponse", {
            success: true
        }));
    }
}
