import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import { ShopPageBotData } from "@Shared/Communications/Responses/Shop/ShopPageBotsEventData";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import FigureWardrobeDialog from "../../Wardrobe/FigureWardrobeDialog";

export type EditShopBotFigureDialogProps = {
    data: Partial<ShopPageBotData> & {
        page: ShopPageData;
        figureConfiguration: FigureConfiguration;
        onChange: (figureConfiguration: FigureConfiguration) => void;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopBotFigureDialog(props: EditShopBotFigureDialogProps) {
    return (
        <FigureWardrobeDialog title={props.data.name ?? "Bot"} initialFigureConfiguration={props.data.figureConfiguration} onApply={(figureConfiguration) => props.data.onChange(figureConfiguration)} {...props}/>
    );
}
