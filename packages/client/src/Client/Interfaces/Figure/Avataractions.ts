export type AvatarActionData = {
    id: string;
    state: string;
    precedence: number;
    main: boolean;
    isDefault: boolean;
    geometryType: string;
    activePartSet: string;
    assetPartDefinition: string;
    prevents: string[];
    animation: false;
    type: {
        id: number;
        animated: boolean;
        prevents: string[];
        preventHeadTurn: boolean;
    }[];
    params: {
        id: string;
        value: number;
    }[];
};

export type AvatarActionsData = AvatarActionData[];
