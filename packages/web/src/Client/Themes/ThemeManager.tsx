import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../Context/Context";

const themes = import.meta.glob("/src/Client/Themes/*/Theme.tsx");

const DefaultTheme = () => null;

export default function ThemeManager() {
  const { state: { currentTheme } } = useContext(GeneralContext);

  const [ThemeComponent, setThemeComponent] =
    useState<React.ComponentType>(() => DefaultTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const key = `/src/Client/Themes/${currentTheme}/Theme.tsx`;

      const importer = themes[key];

      if (!importer) {
        console.error("Theme not found:", currentTheme);
        setThemeComponent(() => DefaultTheme);
        return;
      }

      const module: any = await importer();
      setThemeComponent(() => module.default);
    };

    loadTheme();
  }, [currentTheme]);

  const Theme = ThemeComponent;

  return <Theme />;
}