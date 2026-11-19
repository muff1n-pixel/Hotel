import { webSocketClient } from "@Game/index";
import { GroupData, JoinGroupData, LeaveGroupData } from "@pixel63/events";
import TimeSinceDate from "@UserInterface/Common/Date/TimeSinceDate";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import UserLink from "@UserInterface/Common/Users/UserLink";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import useUserGroup from "@UserInterface/Hooks/useUserGroup";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export type GroupCardProps = {
    data?: GroupData;
}

export default function GroupCard({ data }: GroupCardProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("groups");

    const userGroup = useUserGroup(data?.id);

    const handleJoin = useCallback(() => {
        webSocketClient.sendProtobuff(JoinGroupData, JoinGroupData.create({
            groupId: data?.id
        }));
    }, [data]);

    const handleLeaveGroup = useCallback(() => {
        webSocketClient.sendProtobuff(LeaveGroupData, LeaveGroupData.create({
            groupId: data?.id
        }));
    }, [data]);

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

                    <div>{getTranslation("card.created")} <TimeSinceDate date={new Date(data.createdAt)}/> {getTranslation("card.by")} <UserLink id={data.owner?.id} name={data.owner?.name} reversed/></div>

                    {(data.description) && (
                        <p>{data.description}</p>
                    )}
                </FlexLayout>
            </FlexLayout>
            
            <FlexLayout direction="row" flex={1}>
                <FlexLayout flex={1} direction="column" align="center">
                    {(data.membersCount > 0) && (
                        <DialogLink onClick={() => dialogs.openUniqueDialog("group-members", data.id)}>{getTranslation("card.members", { count: data.membersCount })}</DialogLink>
                    )}
                </FlexLayout>
                
                <FlexLayout flex={2} gap={2} direction="column">
                    <DialogLink>{getTranslation("card.go_to_homeroom")}</DialogLink>
                    <DialogLink>{getTranslation("card.buy_furniture")}</DialogLink>
                </FlexLayout>
            </FlexLayout>

            <div>
                {(!userGroup)?(
                    <DialogButton onClick={handleJoin}>{getTranslation("card.join")}</DialogButton>
                ):(
                    (!userGroup.owner) && (
                        <DialogButton onClick={handleLeaveGroup}>{getTranslation("card.leave")}</DialogButton>
                    )
                )}

                {(userGroup?.owner) && (
                    <DialogButton onClick={() => dialogs.openUniqueDialog("group-settings", data.id)}>{getTranslation("card.edit")}</DialogButton>
                )}
            </div>
        </div>
    );
}