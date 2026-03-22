import { useNavigate, useParams } from "react-router";
import './SafetyPage.css'
import SafetyTips from "../../Components/SafetyPage/SafetyTips";
import PixelWay from "../../Components/SafetyPage/PixelWay";
import { useEffect } from "react";

const SafetyPage = () => {
    const { section } = useParams();
    const navigate = useNavigate();

    const getComposantBySection = () => {
        switch (section) {
            case "safety_tips":
                return <SafetyTips />

            case "pixel_way":
                return <PixelWay />
        }
    }

    useEffect(() => {
        switch (section) {
            case "safety_tips":
            case "pixel_way":
                break;

            default:
                navigate('/404');
                break;
        }
    }, [section])

    return (
        <div className="safetyPage resize">
            <div className="container">
                {getComposantBySection()}
            </div>
        </div>
    )
}

export default SafetyPage;