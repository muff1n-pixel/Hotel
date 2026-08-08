import RoomUserContextMenuActionTab from "./Tabs/RoomUserContextMenuActionTab";
import RoomUserContextMenuDanceTab from "./Tabs/RoomUserContextMenuDanceTab";
import RoomUserContextMenuRelationshipTab from "./Tabs/RoomUserContextMenuRelationshipTab";
import RoomUserContextMenuSignsTab from "./Tabs/RoomUserContextMenuSignsTab";
import RoomUserContextMenuTab, { RoomUserContextMenuTabProps } from "./Tabs/RoomUserContextMenuTab";

export type RoomUserContextMenuTabsProps = RoomUserContextMenuTabProps & {
    tab: string | null;
};

export default function RoomUserContextMenuTabs({ tab, targetUser, setTab, closeTab, close }: RoomUserContextMenuTabsProps) {
    switch(tab) {
        case "dance": {
            return (<RoomUserContextMenuDanceTab targetUser={targetUser} setTab={setTab} closeTab={closeTab} close={close}/>)
        }
        
        case "relationship": {
            return (<RoomUserContextMenuRelationshipTab targetUser={targetUser} setTab={setTab} closeTab={closeTab} close={close}/>)
        }
        
        case "signs": {
            return (<RoomUserContextMenuSignsTab targetUser={targetUser} setTab={setTab} closeTab={closeTab} close={close}/>)
        }
        
        case "actions": {
            return (<RoomUserContextMenuActionTab targetUser={targetUser} setTab={setTab} closeTab={closeTab} close={close}/>)
        }
        
        default: {
            return (<RoomUserContextMenuTab targetUser={targetUser} setTab={setTab} closeTab={closeTab} close={close}/>)
        }
    }
}
