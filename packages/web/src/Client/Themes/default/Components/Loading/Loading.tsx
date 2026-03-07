import loadingImage from '../../Images/loading/loading_bubble.gif';
import './Loading.css'

const Loading = () => {
    return (
        <div className="loading">
            <img src={loadingImage} alt="Loading" />
        </div>
    )
}

export default Loading;