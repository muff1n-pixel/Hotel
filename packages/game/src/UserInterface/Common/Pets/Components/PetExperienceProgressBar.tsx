import { useTranslation } from "react-i18next";
import PetProgressBar from "./PetProgressBar";

export type PetExperienceProgressBarProps = {
    value: number;
    maxValue: number;
};

export default function PetExperienceProgressBar({ value, maxValue }: PetExperienceProgressBarProps) {
    const [getPetTranslation] = useTranslation("pets");

    return (
        <PetProgressBar
            value={value}
            maxValue={maxValue}
            
            primaryBackgroundColor="#A06AD2"
            secondaryBackgroundColor="#8547BE"
            
            title={getPetTranslation("experience")}
            icon={<div className="sprite_room_pet_experience"/>}/>
    );
}
