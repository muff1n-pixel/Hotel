import { FurnitureData, GetShopFurnitureLinkData, ShopFurnitureLinkData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useCallback } from "react";
import { webSocketClient } from "@Game/index";

export type FurnitureShopLinkProps = {
    furniture: FurnitureData;
};

export default function FurnitureShopLink({ furniture }: FurnitureShopLinkProps) {
    const dialogs = useDialogs();

    const handleClick = useCallback(() => {
        webSocketClient.addProtobuffListener(ShopFurnitureLinkData, {
            async handle(payload: ShopFurnitureLinkData) {
                dialogs.openUniqueDialog("shop", {
                    requestedPage: {
                        id: payload.pageId,
                        category: payload.category
                    },
                    requestedFurnitureId: furniture.id
                });
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(GetShopFurnitureLinkData, GetShopFurnitureLinkData.create({
            furnitureId: furniture.id
        }));
    }, [ furniture ]);

    return (
        <FlexLayout direction="row" align="center" gap={5} onClick={handleClick} style={{
            cursor: "pointer"
        }}>
            <div className="sprite_shop-small"/>

            <div>Buy furniture</div>
        </FlexLayout>
    );
}