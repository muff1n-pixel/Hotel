import loadingImage from '../../Images/loading/loading_bubble.gif';
import './Loading.css'

type LoadingProps = {
  style?: React.CSSProperties;
};

const Loading = ({ style }: LoadingProps) => {
    return (
        <div className="loading" style={style}>
            <img src={loadingImage} alt="Loading" />
        </div>
    )
}

export default Loading;