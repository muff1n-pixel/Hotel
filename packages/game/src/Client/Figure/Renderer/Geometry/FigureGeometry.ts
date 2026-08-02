export const figureGeometryTypes = [
    {
        id: "vertical",
        bodyparts: [
            {
                id: "torso",
                parts: [
                    "bd", "bds", "ch", "sh", "lg", "ss", "cp", "wa", "ca", "cc"
                ]
            },
            {
                id: "leftitem",
                parts: [ "li" ]
            },
            {
                id: "rightitem",
                parts: [ "ri" ]
            },
            {
                id: "leftarm",
                parts: [ "lh", "lhs", "ls", "lc" ]
            },
            {
                id: "rightarm",
                parts: [ "rh", "rhs", "rs", "rc" ]
            },
            {
                id: "head",
                parts: [ "hd", "fc", "ey", "hr", "hrb", "fa", "ea", "ha", "he" ]
            }
        ]
    },
    {
        id: "sitting",
        bodyparts: [
            {
                id: "torso",
                parts: [ "bd", "bds", "ch", "sh", "lg", "ss", "cp", "wa", "cc", "ca" ]
            },
            {
                id: "leftitem",
                parts: [ "li" ]
            },
            {
                id: "rightitem",
                parts: [ "ri" ]
            },
            {
                id: "leftarm",
                parts: [ "lh", "lhs", "ls", "lc" ]
            },
            {
                id: "rightarm",
                parts: [ "rh", "rhs", "rs", "rc" ]
            },
            {
                id: "head",
                parts: [ "hd", "fc", "ey", "hr", "hrb", "fa", "ea", "ha", "he" ]
            }
        ]
    }
]

export const geometryById = new Map(
    figureGeometryTypes.map(g => [g.id, g])
);
