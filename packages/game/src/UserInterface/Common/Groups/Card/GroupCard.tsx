import { GroupData, UserGroupData } from "@pixel63/events";
import TimeSinceDate from "@UserInterface/Common/Date/TimeSinceDate";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import UserLink from "@UserInterface/Common/Users/UserLink";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type GroupCardProps = {
    data?: GroupData;
    userData?: UserGroupData;
}

export default function GroupCard({ data, userData }: GroupCardProps) {
    const dialogs = useDialogs();

    if(!data) {
        return null;
    }

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#5D5D5A",
            borderRadius: 5,

            background: "#CBCBCB",

            padding: 8
        }}>
            <FlexLayout direction="row">
                <FlexLayout flex={1} direction="column" align="center">
                    <div>
                        <GroupBadgeImage data={data?.badge} scale={2}/>
                    </div>
                </FlexLayout>
                
                <FlexLayout flex={2} gap={2} direction="column">
                    <b>{data?.name}</b>

                    <div>Created <TimeSinceDate date={new Date(data.createdAt)}/> by <UserLink id={data.owner?.id} name={data.owner?.name} reversed/></div>

                    {(data.description) && (
                        <p>{data.description}</p>
                    )}
                </FlexLayout>
            </FlexLayout>
            
            <FlexLayout direction="row" flex={1}>
                <FlexLayout flex={1} direction="column" align="center">
                    <DialogLink onClick={() => dialogs.openUniqueDialog("group-members", data.id)}>Members: {data.membersCount}</DialogLink>
                </FlexLayout>
                
                <FlexLayout flex={2} gap={2} direction="column">
                    <DialogLink>Go to Group homeroom</DialogLink>
                    <DialogLink>Buy Group Furni</DialogLink>
                </FlexLayout>
            </FlexLayout>

            <div>
                {(!userData) && (
                    <DialogButton>Join Group</DialogButton>
                )}

                {(userData?.admin) && (
                    <DialogButton>Edit Group</DialogButton>
                )}
            </div>
        </div>
    );
}