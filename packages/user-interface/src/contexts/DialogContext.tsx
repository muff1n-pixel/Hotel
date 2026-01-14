import { createContext } from "react";

export type DialogContextState = {
    showShop: boolean;
    setShowShop: (show: boolean) => void;
    
    showWardrobe: boolean;
    setShowWardrobe: (show: boolean) => void;
};

export const DialogContext = createContext<DialogContextState>({
    showShop: false,
    setShowShop: () => {},

    showWardrobe: false,
    setShowWardrobe: () => {}
});
