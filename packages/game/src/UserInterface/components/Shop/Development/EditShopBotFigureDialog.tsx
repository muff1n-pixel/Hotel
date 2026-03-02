import FigureWardrobeDialog from "../../Wardrobe/FigureWardrobeDialog";
import { FigureConfigurationData, ShopBotData, ShopPageData } from "@pixel63/events";

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
    return (
        <FigureWardrobeDialog title="Bot Wardrobe" header={props.data.name ?? "Bot"} initialFigureConfiguration={props.data.figureConfiguration} onApply={(figureConfiguration) => props.data.onChange(figureConfiguration)} {...props}/>
    );
}
