import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { useCallback, useEffect, useRef, useState } from "react";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { GetShopPagesData, ShopFeatureData, ShopFeatureRoomConfigurationData, ShopPageData, ShopPagesData, UpdateShopFeatureData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";
import ShopFeatureImage from "@Client/Images/ShopFeatureImage";
import DialogColorPicker from "@UserInterface/Common/Dialog/Components/ColorPicker/DialogColorPicker";
import FurnitureBrowserSelection from "@UserInterface/Components/Browsers/FurnitureBrowserSelection";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { webSocketClient } from "@Game/index";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useTranslation } from "react-i18next";

export type EditShopFeatureDialogProps = {
    id: string;
    hidden?: boolean;
    data: {
        alignment: "vertical" | "top" | "middle" | "bottom";
        page: ShopPageData;
        feature?: ShopFeatureData;
    };
    onClose?: () => void;
}

export default function EditShopFeatureDialog({ id, hidden, data, onClose }: EditShopFeatureDialogProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const [pages, setPages] = useState<ShopPageData[]>([]);

    const [state, setState] = useState(0);
    const [configuration, setConfiguration] = useState(data.feature?.configuration);
    const [shopFeatureImage] = useState(new ShopFeatureImage(data.alignment, data.feature?.configuration));

    const [title, setTitle] = useState(data.feature?.title);
    const [featuredPageId, setFeaturedPageId] = useState<string | undefined>(data.feature?.featuredPage?.id);

    const [tab, setTab] = useState<"backgroundColors" | "backgroundStripes" | "featureSprite" | "featureFurniture" | "room">("room");

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(ShopPagesData, {
            async handle(payload: ShopPagesData) {
                if(payload.category === "all") {
                    setPages(payload.pages.sort((a, b) => {
                        if (a.index !== b.index) {
                            return a.index - b.index;
                        }

                        return a.title.localeCompare(b.title);
                    }));
                }
            },
        });

        webSocketClient.sendProtobuff(GetShopPagesData, GetShopPagesData.create({
            category: "all"
        }));

        return () => {
            webSocketClient.removeProtobuffListener(ShopPagesData, listener);
        };
    }, []);

    useEffect(() => {
        if(!previewCanvasRef.current) {
            return;
        }

        shopFeatureImage.canvas = previewCanvasRef.current;

        shopFeatureImage.render();

        return shopFeatureImage.configuration.subscribe((value) => {
            setConfiguration(value);
            setState(shopFeatureImage.configuration.state);
        });
    }, [previewCanvasRef]);

    const handleRoomCapture = useCallback(() => {
        dialogs.setDialogHidden(id, true);

        dialogs.addUniqueDialog("edit-shop-feature-camera", {
            alignment: data.alignment,

            onClose: (data: ShopFeatureRoomConfigurationData) => {
                shopFeatureImage.setRoom(data);

                dialogs.setDialogHidden(id, false);
            },

            onCancel: () => {
                dialogs.setDialogHidden(id, false);
            }
        });
    }, [dialogs, data, shopFeatureImage]);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateShopFeatureData, UpdateShopFeatureData.create({
            id: data.feature?.id,
            pageId: data.page.id,
            featuredPageId: featuredPageId,

            title,
            configuration: shopFeatureImage.configuration.value,
            image: shopFeatureImage.canvas?.toDataURL("image/png"),

            alignment: data.alignment,
        }));

        onClose?.();
    }, [ state, data, featuredPageId, title, onClose ]);

    return (
        <Dialog title={(data?.feature)?(getTranslation("edit.feature.edit")):(getTranslation("edit.feature.create"))} editMode hidden={hidden} onClose={onClose} initialPosition="center" width={1280} height={600} style={{
            overflow: "visible"
        }}>
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "row",
                    gap: 20
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <FlexLayout>
                            <b>{getTranslation("edit.feature.preview")}</b>

                            <div style={{
                                background: "#CCCCCC"
                            }}>
                                <canvas ref={previewCanvasRef} width={(data.alignment === "vertical")?(184):(365)} height={(data.alignment === "vertical")?(497):(126)}/>
                            </div>
                        </FlexLayout>
                    </div>

                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setTab("backgroundColors")}>
                           <b>{getTranslation("edit.feature.background")}</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (tab !== "backgroundColors")?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(tab === "backgroundColors") && (
                            <FlexLayout>
                                <Checkbox label={getTranslation("edit.feature.use_background")} value={configuration?.backgroundUsed} onChange={() => shopFeatureImage.toggleBackgroundUsed()}/>

                                <FlexLayout direction="row">
                                    <FlexLayout flex={1} direction="column">
                                        <b>{getTranslation("edit.feature.primary_color")}</b>
                                        
                                        <DialogColorPicker value={configuration?.primaryBackgroundColor} onChange={(color) => shopFeatureImage.setPrimaryBackgroundColor(color)}/>
                                    </FlexLayout>

                                    <FlexLayout flex={1} direction="column">
                                        <b>{getTranslation("edit.feature.secondary_color")}</b>
                                        
                                        <DialogColorPicker value={configuration?.secondaryBackgroundColor} onChange={(color) => shopFeatureImage.setSecondaryBackgroundColor(color)}/>
                                    </FlexLayout>
                                </FlexLayout>
                            </FlexLayout>
                        )}
                        
                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setTab("backgroundStripes")}>
                           <b>{getTranslation("edit.feature.background_stripes")}</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (tab !== "backgroundStripes")?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(tab === "backgroundStripes") && (
                            <FlexLayout>
                                <Checkbox label={getTranslation("edit.feature.use_background_stripes")} value={configuration?.backgroundStripesUsed} onChange={() => shopFeatureImage.toggleBackgroundStripesUsed()}/>
                            </FlexLayout>
                        )}

                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setTab("featureSprite")}>
                           <b>{getTranslation("edit.feature.feature_sprite")}</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (tab !== "featureSprite")?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(tab === "featureSprite") && (
                            <FlexLayout>
                                <Checkbox label={getTranslation("edit.feature.use_feature_sprite")} value={configuration?.useFeatureSprite} onChange={() => shopFeatureImage.toggleFeatureSpriteUsed()}/>
                                
                                <FlexLayout flex={1} direction="column">
                                    <b>{getTranslation("edit.feature.sprite_color")}</b>
                                    
                                    <DialogColorPicker value={configuration?.featureSpriteColor} onChange={(color) => shopFeatureImage.setFeatureSpriteColor(color)}/>
                                </FlexLayout>
                            </FlexLayout>
                        )}

                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setTab("featureFurniture")}>
                           <b>{getTranslation("edit.feature.feature_furniture")}</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (tab !== "featureFurniture")?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(tab === "featureFurniture") && (
                            <FlexLayout>
                                <Checkbox label={getTranslation("edit.feature.use_feature_furniture")} value={configuration?.useFeatureSprite} onChange={() => shopFeatureImage.toggleFeatureFurnitureUsed()}/>
                                
                                <FurnitureBrowserSelection furniture={(configuration?.featureFurniture)?([configuration.featureFurniture]):([])} onChange={(furniture) => shopFeatureImage.setFeatureFurniture(furniture[0])}/>
                            </FlexLayout>
                        )}

                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setTab("room")}>
                           <b>{getTranslation("edit.feature.room_furniture")}</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (tab !== "room")?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(tab === "room") && (
                            <FlexLayout>
                                <Checkbox label={getTranslation("edit.feature.use_room_furniture")} value={configuration?.roomUsed} onChange={() => shopFeatureImage.toggleRoomUsed()}/>
                                
                                <DialogButton onClick={handleRoomCapture}>{getTranslation("edit.feature.capture_room")}</DialogButton>
                            </FlexLayout>
                        )}
                    </div>

                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <b>{getTranslation("edit.feature.title")}</b>

                        <Input value={title} onChange={setTitle}/>

                        <b>{getTranslation("edit.feature.featured_page")}</b>

                        <Selection value={featuredPageId} items={([{value: undefined, label: getTranslation("edit.none")}] as any).concat(...(pages.map((shopPage) => {
                            return {
                                value: shopPage.id,
                                label: (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 5,
                                        alignItems: "center"
                                    }}>
                                        {(shopPage.icon) && (<img src={`./assets/shop/icons/${shopPage.icon}`}/>)}
                                        
                                        <b>{shopPage.title}</b>
                                    </div>
                                )
                            }
                        }) ?? []))} onChange={(value: string) => setFeaturedPageId(value)}/>

                        <div style={{ flex: 1 }}/>

                        <DialogButton onClick={handleApply}>{(data.feature)?(getTranslation("edit.update")):(getTranslation("edit.create"))}</DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
