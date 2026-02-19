import FigureAssets from "@Client/Assets/FigureAssets";
import Dialog from "../Dialog/Dialog";
import { useUser } from "../../hooks/useUser";
import DialogTable from "../Dialog/Table/DialogTable";
import RoomRenderer from "../Room/Renderer/RoomRenderer";
import { useState } from "react";
import DialogTabs from "../Dialog/Tabs/DialogTabs";

export type FigureCatalogDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function FigureCatalogDialog({ hidden, onClose }: FigureCatalogDialogProps) {
    const user = useUser();

    const [action, setAction] = useState<string | null>(null);

    return (
        <Dialog title="Figure Catalog" hidden={hidden} onClose={onClose} width={410} height={560} initialPosition="center">
            <DialogTabs withoutHeader tabs={[
                {
                    icon: "Enables",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 10
                        }}>
                            <div>
                                <RoomRenderer
                                    figureData={{
                                        figureConfiguration: user.figureConfiguration,
                                        actions: (action)?([action]):(undefined),
                                        position: {
                                            row: 10,
                                            column: 10,
                                            depth: 1
                                        }
                                    }}
                                    options={{
                                        rows: 20,
                                        columns: 20
                                    }}
                                    style={{
                                        height: 240
                                    }}/>
                            </div>

                            <DialogTable columns={["ID", "Library"]} items={FigureAssets.effectmap.map((effect) => {
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
                    icon: "Carry items",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 10
                        }}>
                            <div>
                                <RoomRenderer
                                    figureData={{
                                        figureConfiguration: user.figureConfiguration,
                                        actions: (action)?([action]):(undefined),
                                        position: {
                                            row: 10,
                                            column: 10,
                                            depth: 1
                                        }
                                    }}
                                    options={{
                                        rows: 20,
                                        columns: 20
                                    }}
                                    style={{
                                        height: 240
                                    }}/>
                            </div>

                            <DialogTable columns={["ID", "Item ID"]} items={FigureAssets.avataractions.find((action) => action.id === "CarryItem")?.params.map((param) => {
                                return {
                                    id: param.id.toString(),
                                    values: [param.id.toString(), param.value.toString()],
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
