import { select, Separator } from "@inquirer/prompts";
import ChangeEnvironmentSettingsAction from "./actions/ChangeEnvironmentSettingsAction.ts";
import ConvertFurnitureAction from "./actions/ConvertFurnitureAction.ts";
import EnvironmentSettings from "./core/EnvironmentSettings.ts";
import ExtractAction from "./actions/ExtractAction.ts";
import ConvertHabboRoomContentAction from "./actions/ConvertHabboRoomContentAction.ts";

if (!EnvironmentSettings.read()) {
    const action = new ChangeEnvironmentSettingsAction();

    await action.run();
}

export async function runApplication() {
    const action = await select({
        message: "Select action",
        choices: [
            {
                name: "Convert furniture",
                value: "furniture",
                description: "Extract and convert a furniture to the Pixel63 format.",
            },
            {
                name: "Convert HabboRoomContent",
                value: "roomcontent",
                description: "Extract and convert the HabboRoomContent assets to the Pixel63 format.",
            },
            {
                name: "Extract asset",
                value: "extract",
                description: "Extract an SWF without converting it to the Pixel63 format.",
            },
            new Separator(),
            {
                name: "Change environment settings",
                value: "environment"
            }
        ],
    });

    switch (action) {
        case "environment": {
            const action = new ChangeEnvironmentSettingsAction();

            await action.run();

            break;
        }

        case "furniture": {
            const action = new ConvertFurnitureAction();

            await action.run();

            break;
        }

        case "roomcontent": {
            const action = new ConvertHabboRoomContentAction();

            await action.run();

            break;
        }

        case "extract": {
            const action = new ExtractAction();

            await action.run();

            break;
        }
    }
}

await runApplication();
