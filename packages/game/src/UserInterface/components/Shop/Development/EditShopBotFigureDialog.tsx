import { useCallback, useState } from "react";
import FigureWardrobeDialog from "../../Wardrobe/FigureWardrobeDialog";
import { FigureConfigurationData, ShopBotData, ShopPageData } from "@pixel63/events";
import WardrobeAvatar from "@UserInterface/Components/Wardrobe/WardrobeAvatar";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";

export type EditShopBotFigureDialogProps = {
    data: Partial<ShopBotData> & {
        page: ShopPageData;
        figureConfiguration: FigureConfigurationData;
        onChange: (figureConfiguration: FigureConfigurationData) => void;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopBotFigureDialog(props: EditShopBotFigureDialogProps) {
    const [figureConfiguration, setFigureConfiguration] = useState(props.data.figureConfiguration);

    const handleApply = useCallback(() => {
        props.data.onChange(figureConfiguration);
    }, [props.data.onChange, figureConfiguration]);

    return (
        <FigureWardrobeDialog title="Bot Wardrobe" header={props.data.name ?? "Bot"} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} {...props}>
            <div style={{
                flex: 1,

                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{
                    width: 130,
                    height: "100%"
                }}>
                    <WardrobeAvatar configuration={figureConfiguration}/>
                </div>

                <div style={{ width: "100%" }}>
                    <DialogButton onClick={handleApply}>Save my looks</DialogButton>
                </div>
            </div>
        </FigureWardrobeDialog>
    );
}
