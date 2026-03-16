import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [getAbsolutePath("@storybook/addon-docs")],
    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {},
    },
    async viteFinal(config) {
        config.plugins = [...(config.plugins || []), tsconfigPaths()];
        return config;
    },
} satisfies StorybookConfig;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
