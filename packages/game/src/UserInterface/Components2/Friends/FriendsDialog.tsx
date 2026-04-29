import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import FriendsDialogList from "@UserInterface/Components2/Friends/FriendsDialogList";
import FriendsDialogSearch from "@UserInterface/Components2/Friends/FriendsDialogSearch";

export type FriendsDialogProps = {
    hidden?: boolean;
    data?: {
        tab: "list" | "search";
    };
    onClose?: () => void;
}

export default function FriendsDialog({ hidden, data, onClose }: FriendsDialogProps) {
    return (
        <Dialog title="Friends" hidden={hidden} onClose={onClose} width={270} height={380} style={{
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
                        icon: "My friends",
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
