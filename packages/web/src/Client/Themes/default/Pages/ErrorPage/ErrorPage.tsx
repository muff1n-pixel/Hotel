import { useNavigate } from "react-router";
import FrankImage from '../../Images/error/frank.gif';
import Button from "../../Components/Button";
import './ErrorPage.css'

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="errorPage resize">
            <div>
                <img src={FrankImage} alt="Error Frank" />
                <span>Oops, this page could not be found!</span>
                <Button color="green" size="medium" onClick={() => navigate("/")}>Back to home !</Button>
            </div>
        </div>
    )
}

export default ErrorPage;