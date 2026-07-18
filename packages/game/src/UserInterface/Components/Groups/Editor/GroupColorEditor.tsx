import { GroupColorsData } from "@pixel63/events";
import DialogItem from "@UserInterface/Common/Dialog/Components/Item/DialogItem";
import DialogPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useEffect } from "react";

const palette = [
  ["#ffffff","#eaeaea","#d3d3d3","#bcbcbc","#a5a5a5","#8e8e8e","#777777","#606060","#4b4b4b"],
  ["#3a9c00","#369000","#308200","#2b7300","#266500","#215700","#1b4900","#163b00","#112e00"],
  ["#5de100","#56d000","#4ebc00","#45a700","#3d9300","#357d00","#2c6900","#245500","#1c4200"],
  ["#b8eaff","#a9d8ec","#98c3d5","#88adbe","#7798a7","#67838f","#566e78","#465861","#36454c"],
  ["#00c2ff","#00b3eb","#00a1d5","#008fbd","#007ea6","#066c8f","#085b78","#074960","#083a4c"],
  ["#006ed5","#0065c5","#005bb1","#00519d","#00478b","#003d77","#003363","#002951","#00203f"],
  ["#a534ef","#9830dc","#892cc6","#7b26b0","#6b229b","#5c1d86","#4e1970","#3f145a","#300f47"],
  ["#e8a3ff","#d697ef","#c188d8","#ac79c0","#976aa9","#815c91","#6c4d7a","#573d62","#44304d"],
  ["#ff8fe6","#f984d4","#e176bf","#c86aaa","#b05d96","#975080","#7f436c","#663657","#502a44"],
  ["#ff00c3","#f300b4","#db00a2","#c30091","#ab007e","#93006d","#7b025c","#64054a","#4e053a"],
  ["#ff0012","#fe0011","#e50010","#cc000f","#b3000e","#9a000d","#82000c","#69020a","#520308"],
  ["#ffb16c","#f5a364","#dd925a","#c58351","#ad7347","#95633d","#7d5333","#644329","#4f3420"],
  ["#fff1aa","#faecaa","#f2e7ab","#ebe1ac","#e4dbad","#ddd5ae","#d6d0af","#cecaaf","#c9c4b0"],
  ["#aea798","#aaa497","#a6a194","#a39d93","#9e9a91","#9a978e","#97938c","#91908a","#8e8d88"],
];

export type GroupColorEditorProps = {
    data?: GroupColorsData;
    onChange: (data: GroupColorsData) => void;
};

export default function GroupColorEditor({ data, onChange }: GroupColorEditorProps) {
    useEffect(() => {
        if(!data) {
            onChange(GroupColorsData.create({
                primaryColor: "#FFFFFF",
                secondaryColor: "#FFFFFF"
            }));
        }
    }, [data]);

    return (
        <FlexLayout flex={1} direction="row">
            <FlexLayout direction="column">
                <b>Group colors</b>

                <DialogPanel color="silver" contentStyle={{ display: "flex" }}>
                    <FlexLayout flex={1} gap={4} direction="row" align="center" justify="center" style={{
                        padding: 2
                    }}>
                        <DialogItem height={30} containerStyle={{ cursor: "unset" }} style={{
                            background: data?.primaryColor
                        }}/>

                        <DialogItem height={30} containerStyle={{ cursor: "unset" }} style={{
                            background: data?.secondaryColor
                        }}/>
                    </FlexLayout>
                </DialogPanel>
            </FlexLayout>

            <FlexLayout flex={1} direction="column">
                <FlexLayout direction="row" justify="space-between">
                    <b style={{ flex: 3, textAlign: "center" }}>Primary</b>
                    <b style={{ flex: 2, textAlign: "center" }}>Secondary</b>
                </FlexLayout>

                <FlexLayout direction="row" justify="space-between">
                    <FlexLayout flex={3} direction="column" gap={1} style={{
                        background: "#BDBAA2",
                        padding: 3,
                        borderRadius: 3
                    }}>
                        {palette.map((colors, index) => (
                            <FlexLayout key={index} gap={1} direction="row" justify="space-between">
                                {colors.map((color) => (
                                    <div key={color} style={{
                                        display: "flex",
                    
                                        background: color,
                    
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "#000000",
                                        borderRadius: 3,
                    
                                        width: 13,
                                        height: 13,
                    
                                        cursor: "pointer"
                                    }} onClick={() => onChange(GroupColorsData.create({
                                        ...data,
                                        primaryColor: color
                                    }))}>
                                        <div style={{
                                            display: "flex",
                    
                                            flex: 1,
                    
                                            borderWidth: (data?.primaryColor === color)?(1):(1),
                                            borderStyle: "solid",
                                            borderColor: (data?.primaryColor === color)?("#FFFFFF"):("rgba(255, 255, 255, 0.5)"),
                                            borderRadius: 3,
                                        }}>
                                            {(data?.primaryColor === color) && (
                                                <div style={{
                                                    flex: 1,
                    
                                                    borderRadius: 10,
                    
                                                    borderWidth: 2,
                                                    borderStyle: "solid",
                                                    borderColor: "#000000"
                                                }}/>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </FlexLayout>
                        ))}
                    </FlexLayout>

                    <FlexLayout flex={2} direction="column" gap={1} style={{
                        background: "#BDBAA2",
                        padding: 3,
                        borderRadius: 3
                    }}>
                        {palette.map((colors, index) => (
                            <FlexLayout key={index} gap={1} direction="row" justify="space-between">
                                {colors.map((color, index) => (index % 2 === 1 && index !== colors.length - 2)?(null):(
                                    <div key={color} style={{
                                        display: "flex",
                    
                                        background: color,
                    
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "#000000",
                                        borderRadius: 3,
                    
                                        width: 13,
                                        height: 13,
                    
                                        cursor: "pointer"
                                    }} onClick={() => onChange(GroupColorsData.create({
                                        ...data,
                                        secondaryColor: color
                                    }))}>
                                        <div style={{
                                            display: "flex",
                    
                                            flex: 1,
                    
                                            borderWidth: (data?.secondaryColor === color)?(1):(1),
                                            borderStyle: "solid",
                                            borderColor: (data?.secondaryColor === color)?("#FFFFFF"):("rgba(255, 255, 255, 0.5)"),
                                            borderRadius: 3,
                                        }}>
                                            {(data?.secondaryColor === color) && (
                                                <div style={{
                                                    flex: 1,
                    
                                                    borderRadius: 10,
                    
                                                    borderWidth: 2,
                                                    borderStyle: "solid",
                                                    borderColor: "#000000"
                                                }}/>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </FlexLayout>
                        ))}
                    </FlexLayout>
                </FlexLayout>
            </FlexLayout>
        </FlexLayout>
    );
}