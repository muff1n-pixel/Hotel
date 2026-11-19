import { webSocketClient } from "@Game/index";
import { GroupBadgeData, GroupColorsData, UpdateGroupData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import DialogPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import Input from "@UserInterface/Common/Form/Components/Input";
import Radio from "@UserInterface/Common/Form/Components/Radio";
import TextArea from "@UserInterface/Common/Form/Components/TextArea";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import GroupBadgeEditor from "@UserInterface/Components/Groups/Editor/GroupBadgeEditor";
import GroupColorEditor from "@UserInterface/Components/Groups/Editor/GroupColorEditor";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import useGroup from "@UserInterface/Hooks/useGroup";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type GroupSettingsDialogProps = {
    data?: string;
    hidden?: boolean;
    onClose?: () => void;
}

export default function GroupSettingsDialog({ data, hidden, onClose }: GroupSettingsDialogProps) {
    const group = useGroup(data);
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("groups");

    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();

    const [type, setType] = useState<string>();
    const [rights, setRights] = useState<string>();

    const [badge, setBadge] = useState<GroupBadgeData>();

    const [colors, setColors] = useState<GroupColorsData>();

    useEffect(() => {
        if(!group) {
            return;
        }

        setName(group.name);
        setDescription(group.description);

        setType(group.type);
        setRights(group.rights);

        setBadge(group.badge);

        setColors(GroupColorsData.create({
            primaryColor: group.primaryColor,
            secondaryColor: group.secondaryColor,
        }));
    }, [group]);

    const handleUpdate = useCallback(() => {
        if(!group) {
            return;
        }
        
        webSocketClient.sendProtobuff(UpdateGroupData, UpdateGroupData.create({
            id: group.id,

            name,
            description,

            type,
            rights,

            badge,

            primaryColor: colors?.primaryColor,
            secondaryColor: colors?.secondaryColor
        }));

        dialogs.closeDialog("group-settings");
    }, [group, name, description, type, rights, badge, colors]);

    if(!group) {
        return null;
    }

    return (
        <Dialog title={getTranslation("title")} hidden={hidden} onClose={onClose} initialPosition="center" width={400} height={520}>
            <DialogTabs
                tabs={[
                    {
                        icon: getTranslation("settings.identity"),
                        header: {
                            title: getTranslation("settings.identity_title"),
                            description: getTranslation("settings.identity_description"),
                            icon: (<div className="sprite_room_groups_step_1"/>),
                        },
                        element: (
                            <FlexLayout flex={1} direction="row">
                                <FlexLayout direction="column">
                                    <b>{getTranslation("settings.badge_label")}</b>
                    
                                    <DialogPanel color="silver" style={{
                                        aspectRatio: 1
                                    }} contentStyle={{ display: "flex" }}>
                                        <FlexLayout flex={1} align="center" justify="center">
                                            <GroupBadgeImage data={badge}/>
                                        </FlexLayout>
                                    </DialogPanel>

                                    <b>
                                        <DialogLink onClick={() => dialogs.openUniqueDialog("group-members", group.id)}>{getTranslation("settings.members", { count: group.membersCount })}</DialogLink>
                                    </b>
                                </FlexLayout>
                                
                                <FlexLayout flex={1}>
                                    <b>{getTranslation("settings.name")}</b>
                        
                                    <Input value={name} onChange={setName}/>
                                    
                                    <b>{getTranslation("settings.description")}</b>
                        
                                    <TextArea value={description} onChange={setDescription} style={{ height: 60 }}/>
                                </FlexLayout>
                            </FlexLayout>
                        )
                    },
                    {
                        icon: getTranslation("settings.badge"),
                        header: {
                            title: getTranslation("settings.badge_title"),
                            description: getTranslation("settings.badge_description"),
                            icon: (<div className="sprite_room_groups_step_2"/>),
                        },
                        element: (
                            <GroupBadgeEditor data={badge} onChange={setBadge}/>
                        )
                    },
                    {
                        icon: getTranslation("settings.colors"),
                        header: {
                            title: getTranslation("settings.colors_title"),
                            description: getTranslation("settings.colors_description"),
                            icon: (<div className="sprite_room_groups_step_3"/>),
                        },
                        element: (
                            <GroupColorEditor data={colors} onChange={setColors}/>
                        )
                    },
                    {
                        icon: getTranslation("settings.preferences"),
                        header: {
                            title: getTranslation("settings.settings_title"),
                            description: getTranslation("settings.settings_description"),
                            icon: (<div className="sprite_room_groups_step_4"/>),
                        },
                        element: (
                            <FlexLayout flex={1} direction="column">
                                <FlexLayout direction="row">
                                    <b style={{ flex: 1, textAlign: "center" }}>{getTranslation("settings.type")}</b>
                                    <b style={{ flex: 1, textAlign: "center" }}>{getTranslation("settings.rights")}</b>
                                </FlexLayout>
                                
                                <FlexLayout direction="row">
                                    <DialogPanel style={{ flex: 1, height: "min-content" }} contentStyle={{
                                        background: "transparent",
                                        padding: 4
                                    }}>
                                        <Radio value={type} onChange={setType} items={[
                                            {
                                                label: (
                                                    <FlexLayout direction="column" gap={2}>
                                                        <b>{getTranslation("settings.public")}</b>
                                                        <div>{getTranslation("settings.public_description")}</div>
                                                    </FlexLayout>
                                                ),
                                                value: "public"
                                            },
                                            {
                                                label: (
                                                    <FlexLayout direction="column" gap={2}>
                                                        <b>{getTranslation("settings.exclusive")}</b>
                                                        <div>{getTranslation("settings.exclusive_description")}</div>
                                                    </FlexLayout>
                                                ),
                                                value: "exclusive"
                                            },
                                            {
                                                label: (
                                                    <FlexLayout direction="column" gap={2}>
                                                        <b>{getTranslation("settings.private")}</b>
                                                        <div>{getTranslation("settings.private_description")}</div>
                                                    </FlexLayout>
                                                ),
                                                value: "private"
                                            }
                                        ]}/>
                                    </DialogPanel>
                                    
                                    <DialogPanel style={{ flex: 1, height: "min-content" }} contentStyle={{
                                        background: "transparent",
                                        padding: 4
                                    }}>
                                        <Radio value={rights} onChange={setRights} items={[
                                            {
                                                label: (
                                                    <FlexLayout direction="column" gap={2}>
                                                        <b>{getTranslation("settings.owner_only")}</b>
                                                        <div>{getTranslation("settings.owner_only_description")}</div>
                                                    </FlexLayout>
                                                ),
                                                value: "owner"
                                            },
                                            {
                                                label: (
                                                    <FlexLayout direction="column" gap={2}>
                                                        <b>{getTranslation("settings.all_members")}</b>
                                                        <div>{getTranslation("settings.all_members_description")}</div>
                                                    </FlexLayout>
                                                ),
                                                value: "members"
                                            },
                                            {
                                                label: (
                                                    <FlexLayout direction="column" gap={2}>
                                                        <b>{getTranslation("settings.admins")}</b>
                                                        <div>{getTranslation("settings.admins_description")}</div>
                                                    </FlexLayout>
                                                ),
                                                value: "admins"
                                            }
                                        ]}/>
                                    </DialogPanel>
                                </FlexLayout>
                            </FlexLayout>
                        )
                    },
                ]}
                children={(
                    <FlexLayout align="flex-end">
                        <DialogButton onClick={handleUpdate}>{getTranslation("settings.update")}</DialogButton>
                    </FlexLayout>
                )}/>
        </Dialog>
    );
}
