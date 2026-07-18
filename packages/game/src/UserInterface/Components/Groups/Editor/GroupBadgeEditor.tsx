import { GroupBadgeData } from "@pixel63/events";
import DialogPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";
import GroupBadgeSymbolEditor, { groupBadgeSymbols } from "@UserInterface/Components/Groups/Editor/GroupBadgeSymbolEditor";
import { useEffect, useState } from "react";
import GroupBadgeBaseEditor, { groupBadgeBases } from "@UserInterface/Components/Groups/Editor/GroupBadgeBaseEditor";

export type GroupBadgeEditorProps = {
    data?: GroupBadgeData;
    onChange: (data: GroupBadgeData) => void;
};

export default function GroupBadgeEditor({ data, onChange }: GroupBadgeEditorProps) {
    const [symbolPicking, setSymbolPicking] = useState<1 | 2 | 3 | 4>();
    const [basePicking, setBasePicking] = useState<boolean>();

    useEffect(() => {
        if(!data) {
            onChange(GroupBadgeData.create({
                base: {
                    image: "badgepart_base_basic_1",
                    color: "#FFFFFF"
                },

                symbol1: {
                    image: "badgepart_symbol_1",
                    color: "#FFFFFF",
                    position: 1
                }
            }));
        }
    }, [data]);

    return (
        <FlexLayout flex={1} direction="row">
            <FlexLayout direction="column">
                <b>Group badge</b>

                <DialogPanel color="silver" style={{
                    aspectRatio: 1
                }} contentStyle={{ display: "flex" }}>
                    <FlexLayout flex={1} align="center" justify="center">
                        <GroupBadgeImage data={data}/>
                    </FlexLayout>
                </DialogPanel>
            </FlexLayout>

            {(!symbolPicking && !basePicking)?(
                <FlexLayout flex={1} direction="column">
                    <FlexLayout direction="row" justify="space-between">
                        <b style={{ flex: 1 }}>Symbol</b>
                        <b style={{ flex: 1 }}>Position</b>
                        <b style={{ flex: 2 }}>Color</b>
                    </FlexLayout>

                    <FlexLayout gap={2} direction="column">
                        <GroupBadgeSymbolEditor data={data?.symbol1} onChange={(symbol1) => onChange(GroupBadgeData.create({
                            ...data,
                            symbol1
                        }))} onSymbolChange={() => setSymbolPicking(1)}/>

                        <GroupBadgeSymbolEditor data={data?.symbol2} onChange={(symbol2) => onChange(GroupBadgeData.create({
                            ...data,
                            symbol2
                        }))} onSymbolChange={() => setSymbolPicking(2)}/>

                        <GroupBadgeSymbolEditor data={data?.symbol3} onChange={(symbol3) => onChange(GroupBadgeData.create({
                            ...data,
                            symbol3
                        }))} onSymbolChange={() => setSymbolPicking(3)}/>

                        <GroupBadgeSymbolEditor data={data?.symbol4} onChange={(symbol4) => onChange(GroupBadgeData.create({
                            ...data,
                            symbol4
                        }))} onSymbolChange={() => setSymbolPicking(4)}/>
                    </FlexLayout>

                    <FlexLayout gap={2} direction="column">
                        <GroupBadgeBaseEditor data={data?.base} onChange={(base) => onChange(GroupBadgeData.create({
                            ...data,
                            base
                        }))} onBaseChange={() => setBasePicking(true)}/>
                    </FlexLayout>
                </FlexLayout>
            ):(
                (basePicking || !symbolPicking)?(
                    <FlexLayout direction="column" style={{
                        flex: 1
                    }}>
                        <DialogScrollArea style={{ flex: "1 1 0" }}>
                            <FlexLayout gap={5} direction="row" style={{
                                flexWrap: "wrap"
                            }}>
                                {groupBadgeBases.map((image) => (
                                    <div key={image} style={{
                                        width: 40,
                                        height: 40,

                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        borderRadius: 5,

                                        cursor: "pointer"
                                    }} onClick={() => {
                                        onChange(GroupBadgeData.create({
                                            ...data,
                                            base: {
                                                ...data?.base,
                                                image
                                            }
                                        }));

                                        setBasePicking(undefined);
                                    }}>
                                        <img src={`/assets/groups/${image}.png`}/>
                                    </div>
                                ))}
                            </FlexLayout>
                        </DialogScrollArea>
                    </FlexLayout>
                ):(
                    <FlexLayout direction="column" style={{
                        flex: 1
                    }}>
                        <DialogScrollArea style={{ flex: "1 1 0" }}>
                            <FlexLayout gap={5} direction="row" style={{
                                flexWrap: "wrap"
                            }}>
                                <div style={{
                                    width: 40,
                                    height: 40,

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",

                                    borderRadius: 5,

                                    boxSizing: "border-box",

                                    cursor: "pointer"
                                }} onClick={() => {
                                        onChange(GroupBadgeData.create({
                                            ...data,
                                            [`symbol${symbolPicking}`]: {
                                                ...data?.[`symbol${symbolPicking}`],
                                                image: undefined
                                            }
                                        }));

                                        setSymbolPicking(undefined);
                                    }}>
                                    <div className="sprite_dialog_remove_selection"/>
                                </div>

                                {groupBadgeSymbols.map((image) => (
                                    <div key={image} style={{
                                        width: 40,
                                        height: 40,

                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        borderRadius: 5,

                                        cursor: "pointer"
                                    }} onClick={() => {
                                        onChange(GroupBadgeData.create({
                                            ...data,
                                            [`symbol${symbolPicking}`]: {
                                                position: 5,
                                                ...data?.[`symbol${symbolPicking}`],
                                                image
                                            }
                                        }));

                                        setSymbolPicking(undefined);
                                    }}>
                                        <img src={`/assets/groups/${image}.png`}/>
                                    </div>
                                ))}
                            </FlexLayout>
                        </DialogScrollArea>
                    </FlexLayout>
                )
            )}
        </FlexLayout>
    );
}