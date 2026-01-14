import { ShopPagesResponse } from "@shared/WebSocket/Events/Shop/ShopPagesResponse.js";
import UserClient from "../Clients/UserClient.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { ShopPage } from "../Database/Models/Shop/ShopPage.js";
import { ShopPagesRequest } from "@shared/WebSocket/Events/Shop/ShopPagesRequest.js";
import { ShopPageFurnitureRequest } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureRequest.js";
import { ShopPageFurniture } from "../Database/Models/Shop/ShopPageFurniture.js";
import { ShopPageFurnitureResponse } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureResponse.js";

export default class ShopEvents {
    public static async dispatchShopPages(userClient: UserClient, event: ShopPagesRequest) {
        if(event.category !== "furniture") {
            return;
        }

        const shopPages: ShopPage[] = await ShopPage.findAll({
            where: {
                category: "furniture",
                parentId: null
            },
            include: {
                model: ShopPage,
                as: "children"
            }
        });

        userClient.send(new OutgoingEvent<ShopPagesResponse>("ShopPagesResponse", {
            category: "furniture",
            pages: shopPages.map((shopPage) => {
                return {
                    id: shopPage.id,
                    title: shopPage.title,
                    type: shopPage.type,
                    icon: shopPage.icon ?? undefined,
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
        const shopPage = await ShopPage.findByPk(event.pageId, {
            include: {
                model: ShopPageFurniture,
                as: "furniture"
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
                    type: furniture.type
                }
            })
        }));
    }
}
