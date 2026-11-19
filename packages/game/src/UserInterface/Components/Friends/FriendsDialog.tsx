import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import FriendsDialogList from "@UserInterface/Components/Friends/FriendsDialogList";
import FriendsDialogSearch from "@UserInterface/Components/Friends/FriendsDialogSearch";
import { useTranslation } from "react-i18next";

export type FriendsDialogProps = {
    hidden?: boolean;
    data?: {
        tab: "list" | "search";
    };
    onClose?: () => void;
}

export default function FriendsDialog({ hidden, data, onClose }: FriendsDialogProps) {
    const [getTranslation] = useTranslation("friends");

    return (
        <Dialog title={getTranslation("title")} hidden={hidden} onClose={onClose} width={280} height={380} style={{
            overflow: "visible"
        }}>
            <DialogTabs
                height={60}
                initialActiveIndex={(data?.tab === "search")?(1):(0)}
                header={{
                    backgroundImage: "./assets/friends/Friendsfor4Town.png",
                    backgroundImageOffset: -10
                }}
                tabs={[
                    {
                        icon: getTranslation("tabs.my_friends"),
                        element: (<FriendsDialogList/>),
                    },
                    {
                        icon: (<div className="sprite_friends_search" style={{ overflow: "visible", position: "absolute", bottom: 1 }}/>),
                        transparent: true,
                        alignSelf: "flex-end",

                        element: (<FriendsDialogSearch/>),
                    }
                ]}>

            </DialogTabs>
        </Dialog>
    );
}
