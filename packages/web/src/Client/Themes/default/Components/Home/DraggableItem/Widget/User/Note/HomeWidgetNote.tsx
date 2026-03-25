import { HomeItemType} from "../../../../../../Pages/HomePage/HomePage";
import './HomeWidgetNote.css'

type HomeWidgetNoteProps = {
    borderSkin: string | null;
    item: HomeItemType;
}

export const HomeWidgetNote = ({ borderSkin, item}: HomeWidgetNoteProps) => {
    return (
        <div className={`noteWidget widget skin ${borderSkin}`}>
            <div className="widgetCorner">
                <div className="widgetHeadline">
                    <div className='widgetTitle'></div>
                </div>
            </div>

            <div className="widgetBody">
                <div className="widgetContent">
                    <div className='note'>{item.data}</div>
                </div>
            </div>
        </div>
    )
}

export default HomeWidgetNote;