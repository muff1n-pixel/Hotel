import { useTranslation } from "react-i18next";
import PetProgressBar from "./PetProgressBar";

export type PetHappinessProgressBarProps = {
    value: number;
    maxValue: number;
};

export default function PetHappinessProgressBar({ value, maxValue }: PetHappinessProgressBarProps) {
    const [getPetTranslation] = useTranslation("pets");
    
    return (
        <PetProgressBar
            value={value}
            maxValue={maxValue}
            
            primaryBackgroundColor="#1FD1F2"
            secondaryBackgroundColor="#009AC0"
            
            title={getPetTranslation("happiness")}
            icon={<div className="sprite_room_pet_happiness"/>}/>
    );
}
