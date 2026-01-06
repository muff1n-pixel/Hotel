import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";

function getValueAsArray(value: any) {
    if(!value) {
        return [];
    }

    if(value.length) {
        return value;
    }

    return [value];
}

export function createFiguremapData(): any {
    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync("assets/figuremap.xml", { encoding: "utf-8" }), true);

    return document.map.lib.map((library: any) => {
        return {
            id: library["@_id"],
            parts: getValueAsArray(library.part).map((part: any) => {
                return {
                    id: parseInt(part["@_id"]),
                    type: part["@_type"]
                }
            })
        };
    });
}

export function createFiguredataData(): any {
    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync("assets/figuredata.xml", { encoding: "utf-8" }), true);


    return {
        palettes: document["figuredata"]["colors"]["palette"].map((palette: any) => {
            return {
                id: parseInt(palette["@_id"]),
                colors: palette["color"].map((color: any) => {
                    return {
                        id: parseInt(color["@_id"]),
                        index: parseInt(color["@_index"]),
                        club: color["@_club"] === '1',
                        selectable: color["@_selectable"] === '1',
                        preselectable: color["@_preselectable"] === '1',
                        color: color["#text"]
                    }
                })
            }
        }),

        sets: document["figuredata"]["sets"]["settype"].map((settype: any) => {
            return {
                type: settype["@_type"],
                paletteId: parseInt(settype["@_paletteid"]),
                mandatoryGender: {
                    male: [ parseInt(settype["@_mand_m_0"]), parseInt(settype["@_mand_m_1"]) ],
                    female: [ parseInt(settype["@_mand_m_0"]), parseInt(settype["@_mand_m_1"]) ]
                },
                sets: settype["set"].map((set: any) => {
                    return {
                        id: parseInt(set["@_id"]),
                        gender: set["@_gender"],
                        club: set["@_club"] === '1',
                        colorable: set["@_colorable"] === '1',
                        selectable: set["@_selectable"] === '1',
                        preselectable: set["@_preselectable"] === '1',

                        parts: getValueAsArray(set["part"]).map((part: any) => {
                            return {
                                id: parseInt(part["@_id"]),
                                type: part["@_part"],
                                colorable: set["@_colorable"] === '1',
                                index: parseInt(part["@_index"]),
                                colorIndex: parseInt(part["@_colorindex"])
                            }
                        }),

                        hiddenPartTypes: (set["hiddenlayers"]?.["layer"])?(getValueAsArray(set["hiddenlayers"]?.["layer"]).map((layer: any) => {
                            return layer["@_parttype"];
                        })):(undefined)
                    }
                })
            }
        })
    }
}
