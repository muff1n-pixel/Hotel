import type { Preview } from "@storybook/react-vite";

import "../src/UserInterface/Styles/fonts.css";
import "../src/UserInterface/Styles/index.css";
import "../src/UserInterface/Styles/spritesheet.css";

export default {
    tags: ['autodocs'],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
} satisfies Preview;
