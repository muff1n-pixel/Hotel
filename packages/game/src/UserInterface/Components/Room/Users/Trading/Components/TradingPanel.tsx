import { RoomUserData, UserInventoryFurnitureData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import FurnitureIcon from "@UserInterface/Components/Furniture/FurnitureIcon";
import { Fragment } from "react/jsx-runtime";

export type TradingPanelProps = {
    user?: RoomUserData;
    locked: boolean;
    userFurniture: UserInventoryFurnitureData[];
    onDelete?: (userFurniture: UserInventoryFurnitureData) => void;
};

export default function TradingPanel({ user, locked, userFurniture, onDelete }: TradingPanelProps) {
    return (
        <FlexLayout direction="column">
            {(user)?(
                <div><b>{user.name}</b> is offering</div>
            ):(
                <div><b>You</b> are offering</div>
            )}

            <FlexLayout direction="row" align="flex-end">
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 38px)",
                    gridTemplateRows: "repeat(3, 38px)",
                    alignItems: "flex-start",
                    justifyItems: "flex-start",
                    gap: 5
                }}>
                    {Array(9).fill(null).map((_, index) => (
                        <FlexLayout key={index} justify="center" align="center" style={{
                            background: "#E2E2E2",
                            border: "1px solid #CACACA",
                            borderRadius: 4,
                            
                            width: 38,
                            height: 38,

                            position: "relative",

                            cursor: (onDelete)?("pointer"):("unset")
                        }} onClick={() => userFurniture[index] && onDelete?.(userFurniture[index])}>
                            {userFurniture[index] && (
                                <Fragment>
                                    <FurnitureIcon furnitureData={userFurniture[index].furniture}/>

                                    {(userFurniture[index].quantity > 1) && (
                                        <div style={{
                                            position: "absolute",

                                            right: 2,
                                            top: 2,

                                            border: "1px solid #2F6982",
                                            background: "#FFF",
                                            color: "#306A83",

                                            fontSize: 10,

                                            padding: "0px 2px"
                                        }}>
                                            {userFurniture[index].quantity}
                                        </div>
                                    )}
                                </Fragment>
                            )}
                        </FlexLayout>
                    ))}
                </div>

                <div className={(locked)?("sprite_room_user_trading_locked"):("sprite_room_user_trading_unlocked")} style={{
                    margin: 10
                }}/>
            </FlexLayout>

            <div style={{
                fontSize: 12
            }}>
                {userFurniture.reduce((previousValue, userFurniture) => previousValue + userFurniture.quantity, 0)} items offered
            </div>
        </FlexLayout>
    );
}