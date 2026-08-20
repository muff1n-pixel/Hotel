import { useTranslation } from "react-i18next";
import PetProgressBar from "./PetProgressBar";

export type PetEnergyProgressBarProps = {
    value: number;
    maxValue: number;
};

export default function PetEnergyProgressBar({ value, maxValue }: PetEnergyProgressBarProps) {
    const [getPetTranslation] = useTranslation("pets");

    return (
        <PetProgressBar
            value={value}
            maxValue={maxValue}
            
            primaryBackgroundColor="#8AC51E"
            secondaryBackgroundColor="#5E9D00"
            
            title={getPetTranslation("energy")}
            icon={<div className="sprite_room_pet_energy"/>}/>
    );
}
