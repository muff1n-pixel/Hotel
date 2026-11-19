import FigureAssets from "@Client/Assets/FigureAssets";
import Dialog from "../../Common/Dialog/Dialog";
import { useUser } from "../../Hooks/useUser";
import DialogTable from "../../Common/Dialog/Components/Table/DialogTable";
import { useState } from "react";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import { RoomPositionData, RoomStructureData } from "@pixel63/events";
import { useTranslation } from "react-i18next";
import RoomRenderer from "@UserInterface/Common/Room/RoomRenderer";
import { clientInstance } from "@Game/index";

export type FigureCatalogDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function FigureCatalogDialog({ hidden, onClose }: FigureCatalogDialogProps) {
    const user = useUser();
    const [getCarryItemTranslation] = useTranslation("carryitems");
    const [getTranslation] = useTranslation("catalogs");

    const [action, setAction] = useState<string | null>(null);

    if(!user.figureConfiguration) {
        return null;
    }

    return (
        <Dialog title={getTranslation("figure.title")} hidden={hidden} onClose={onClose} width={410} height={560} initialPosition="center">
            <DialogTabs withoutHeader tabs={[
                {
                    icon: getTranslation("figure.enables"),
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 10
                        }}>
                            <div style={{ height: 240 }}>
                                <RoomRenderer
                                    figure={[
                                        {
                                            id: "user",
                                            figureConfiguration: user.figureConfiguration,
                                            actions: (action)?([action]):(undefined),
                                            position: RoomPositionData.create({
                                                row: 10,
                                                column: 10,
                                                depth: 1
                                            })
                                        }
                                    ]}
                                    structure={RoomStructureData.create({
                                        grid: new Array(20).fill(null).map((_) => new Array(20).fill(null).map(() => '0').join('')),
                                        floor: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.floor?.id ?? "111",
                                            thickness: 8
                                        },
                                        wall: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.wall?.id ?? "201",
                                            thickness: 8,
                                            hidden: false
                                        },
                                        landscape: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.landscape?.id ?? "default",
                                        }
                                    })}/>
                            </div>

                            <DialogTable activeId={action?.split('.')[1]} columns={[getTranslation("figure.id"), getTranslation("figure.library")]} items={FigureAssets.effectmap.filter((effect) => effect.id).map((effect) => {
                                return {
                                    id: effect.id.toString(),
                                    values: [effect.id.toString(), effect.library],
                                    onClick: () => setAction(`AvatarEffect.${effect.id}`)
                                }
                            })}/>
                        </div>
                    )
                },
                {
                    icon: getTranslation("figure.carry_items"),
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 10
                        }}>
                            <div style={{ height: 240 }}>
                                <RoomRenderer
                                    figure={[
                                        {
                                            id: "user",
                                            figureConfiguration: user.figureConfiguration,
                                            actions: (action)?([action]):(undefined),
                                            position: RoomPositionData.create({
                                                row: 10,
                                                column: 10,
                                                depth: 1
                                            })
                                        }
                                    ]}
                                    structure={RoomStructureData.create({
                                        grid: new Array(20).fill(null).map((_) => new Array(20).fill(null).map(() => '0').join('')),
                                        floor: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.floor?.id ?? "111",
                                            thickness: 8
                                        },
                                        wall: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.wall?.id ?? "201",
                                            thickness: 8,
                                            hidden: false
                                        },
                                        landscape: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.landscape?.id ?? "default",
                                        }
                                    })}/>
                            </div>

                            <DialogTable activeId={action?.split('.')[1]} columns={[getTranslation("figure.item_id"), getTranslation("figure.name")]} items={FigureAssets.avataractions.find((action) => action.id === "CarryItem")?.params.map((param) => {
                                return {
                                    id: param.value.toString(),
                                    values: [param.value.toString(), getCarryItemTranslation(`handitem_${param.value}`)],
                                    onClick: () => setAction(`CarryItem.${param.value}`)
                                }
                            })}/>
                        </div>
                    )
                }
            ]}/>
        </Dialog>
    );
}
