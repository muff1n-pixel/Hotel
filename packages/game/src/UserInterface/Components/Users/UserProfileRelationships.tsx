import { UserProfileData_UserProfileFriendRelationshipsData } from "@pixel63/events/build/User/Profile/UserProfileData";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type UserProfileRelationshipsProps = {
    relationships: UserProfileData_UserProfileFriendRelationshipsData[];
};

export default function UserProfileRelationships({ relationships }: UserProfileRelationshipsProps) {
    const dialogs = useDialogs();
    
    return (
        <FlexLayout flex={1} gap={2} style={{
            fontSize: 12,
        }}>
            <div style={{
                color: "#000000",
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 5,

                fontFamily: "Ubuntu Bold",

                textDecoration: "underline",

                position: "relative",

                cursor: "pointer"
            }} onClick={() => dialogs.addUniqueDialog("user-profile", relationships[0].userId, relationships[0].userId)}>
                {(!relationships.length)?(
                    "Add friends"
                ):(
                    (relationships.length === 1)?(
                        relationships[0].name
                    ):(
                        relationships[0].name + " and " + (relationships.length - 1) + "others"
                    )
                )}

                {(relationships.length > 0) && (
                    <div style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0
                    }}>
                        <FigureImage direction={4} figureConfiguration={relationships[0].figureConfigurationData} headOnly/>
                    </div>
                )}
            </div>

            {(!relationships.length) && (
                <div style={{
                    color: "#888887",
                    fontFamily: "Ubuntu Italic"
                }}>
                    No friends in this category
                </div>
            )}
        </FlexLayout>
    );
}
