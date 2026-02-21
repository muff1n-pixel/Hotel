import type { RouteObject } from "react-router";
import { GeneralContext } from "../Context/Context";
import { useContext, useEffect } from "react";
import { useRoutes } from "react-router";

type RouterModule = {
    routes: RouteObject[];
};

type ProviderModule = {
  ThemeProvider: React.ComponentType<{
    children: React.ReactNode;
  }>;
};

const providersModules = import.meta.glob<ProviderModule>(
    "/src/Client/Themes/*/ThemeProvider.tsx",
    { eager: true }
);

const routersModules = import.meta.glob<RouterModule>(
    "/src/Client/Themes/*/Router.tsx",
    { eager: true }
);

const ThemeManager = () => {
    const { state: { currentTheme }, dispatch } = useContext(GeneralContext);

    const ThemesRouter = routersModules[`/src/Client/Themes/${currentTheme}/Router.tsx`],
        ThemeProviderKey = `/src/Client/Themes/${currentTheme}/ThemeProvider.tsx`,
        ThemeProvider = providersModules[ThemeProviderKey]?.ThemeProvider ?? (({ children }) => children);

    if (ThemesRouter === undefined) {
        return (
            <div>Invalid theme provided or impossible to find the theme provider.</div>
        )
    }
    else {
        const element = useRoutes(ThemesRouter.routes);
        return (
            <ThemeProvider>
                {element}
            </ThemeProvider>
        )
    }
}

export default ThemeManager;