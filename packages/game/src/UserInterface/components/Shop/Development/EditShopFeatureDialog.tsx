import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { useCallback, useEffect, useRef, useState } from "react";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { ShopFeatureData, ShopPageData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";
import ShopFeatureImage from "@Client/Images/ShopFeatureImage";
import DialogColorPicker from "@UserInterface/Common/Dialog/Components/ColorPicker/DialogColorPicker";
import FurnitureBrowserSelection from "@UserInterface/Components/Browsers/FurnitureBrowserSelection";

export type EditShopFeatureDialogProps = {
    hidden?: boolean;
    data: {
        alignment: "vertical" | "top" | "middle" | "bottom";
        page: ShopPageData;
        feature?: ShopFeatureData;
    };
    onClose?: () => void;
}

export default function EditShopFeatureDialog({ hidden, data, onClose }: EditShopFeatureDialogProps) {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const [state, setState] = useState(0);
    const [configuration, setConfiguration] = useState(data.feature?.configuration);
    const [shopFeatureImage] = useState(new ShopFeatureImage(data.alignment, data.feature?.configuration));

    const [backgroundColorsMinimized, setBackgroundColorsMinimized] = useState(true);
    const [backgroundStripesMinimized, setBackgroundStripesMinimized] = useState(true);
    const [featureSpriteMinimized, setFeatureSpriteMinimized] = useState(true);
    const [featureFurnitureMinimized, setFeatureFurnitureMinimized] = useState(true);

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

    const handleApply = useCallback(() => {
    }, []);

    return (
        <Dialog title={(data?.feature)?("Edit Shop Feature"):("Create Shop Feature")} hidden={hidden} onClose={onClose} initialPosition="center" width={720} height="auto" assumedHeight={420} style={{
            overflow: "visible"
        }}>
            <DialogContent>
                <div style={{
                    display: "flex",
                    flexDirection: (data.alignment === "vertical")?("row"):("column"),
                    gap: 20
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <FlexLayout>
                            <b>Preview</b>

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
                        <Checkbox label="Use background?" value={configuration?.backgroundUsed} onChange={() => shopFeatureImage.toggleBackgroundUsed()}/>

                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setBackgroundColorsMinimized(!backgroundColorsMinimized)}>
                           <b>Background</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (backgroundColorsMinimized)?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(!backgroundColorsMinimized) && (
                            <FlexLayout>

                                <FlexLayout direction="row">
                                    <FlexLayout flex={1} direction="column">
                                        <b>Primary Color</b>
                                        
                                        <DialogColorPicker value={configuration?.primaryBackgroundColor} onChange={(color) => shopFeatureImage.setPrimaryBackgroundColor(color)}/>
                                    </FlexLayout>

                                    <FlexLayout flex={1} direction="column">
                                        <b>Secondary Color</b>
                                        
                                        <DialogColorPicker value={configuration?.secondaryBackgroundColor} onChange={(color) => shopFeatureImage.setSecondaryBackgroundColor(color)}/>
                                    </FlexLayout>
                                </FlexLayout>
                            </FlexLayout>
                        )}
                        
                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setBackgroundStripesMinimized(!backgroundStripesMinimized)}>
                           <b>Background Stripes</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (backgroundStripesMinimized)?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(!backgroundStripesMinimized) && (
                            <FlexLayout>
                                <Checkbox label="Use background stripes?" value={configuration?.backgroundStripesUsed} onChange={() => shopFeatureImage.toggleBackgroundStripesUsed()}/>
                            </FlexLayout>
                        )}

                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setFeatureSpriteMinimized(!featureSpriteMinimized)}>
                           <b>Feature Sprite</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (featureSpriteMinimized)?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(!featureSpriteMinimized) && (
                            <FlexLayout>
                            <Checkbox label="Use feature sprite?" value={configuration?.useFeatureSprite} onChange={() => shopFeatureImage.toggleFeatureSpriteUsed()}/>
                                
                                <FlexLayout direction="row">
                                    <FlexLayout flex={1} direction="column">
                                        <b>Sprite Color</b>
                                        
                                        <DialogColorPicker value={configuration?.featureSpriteColor} onChange={(color) => shopFeatureImage.setFeatureSpriteColor(color)}/>
                                    </FlexLayout>

                                    <div style={{ flex: 1 }}/>
                                </FlexLayout>
                            </FlexLayout>
                        )}

                        <FlexLayout direction="row" justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setFeatureFurnitureMinimized(!featureFurnitureMinimized)}>
                           <b>Feature Furniture</b>
                            
                            <div className="sprite_forms_arrow" style={{
                                transform: (featureFurnitureMinimized)?("rotateZ(-90deg)"):(undefined)
                            }}/>
                        </FlexLayout>

                        {(!featureFurnitureMinimized) && (
                            <FlexLayout>
                                <Checkbox label="Use feature furniture?" value={configuration?.useFeatureSprite} onChange={() => shopFeatureImage.toggleFeatureFurnitureUsed()}/>
                                
                                <FurnitureBrowserSelection furniture={configuration?.featureFurniture} onChange={(furniture) => shopFeatureImage.setFeatureFurniture(furniture)}/>
                            </FlexLayout>
                        )}

                        <div style={{ flex: 1 }}/>

                        <DialogButton onClick={handleApply}>{(data.feature)?("Update feature"):("Create feature")}</DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
