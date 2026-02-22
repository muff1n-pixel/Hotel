import './NewsContainer.css';

const NewsContainer = () => {
    return (
        <div>
            <div className='newsContainer'>
                <div className='show_banner'>
                    <h4>LATEST NEWS</h4>
                    <h2>Title of the article</h2>
                    <p>Mauris euismod, arcu id lacinia pulvinar, nulla justo porta enim, vel vestibulum tellus magna eget odio. Sed varius est eu tellus egestas, id imperdiet tellus aliquet. Aliquam id pretium sapien. Etiam auctor, purus et ornare accumsan, neque magna lobortis mi, sed feugiat eros elit id felis. Aliquam pellentesque auctor aliquam. Sed accumsan scelerisque felis, ac dictum velit sagittis ut. Nullam id mi a turpis aliquam lacinia. Quisque hendrerit massa turpis, in ultrices mi accumsan quis....</p>
                    <button>Read more »</button>
                </div>

                <div className='row'>
                    <div className='title'>Title of the article 1...</div>
                    <span>22/02/2026 at 15:14</span>
                </div>
                <div className='row'>
                    <div className='title'>Title of the article 1...</div>
                    <span>22/02/2026 at 15:14</span>
                </div>
                <div className='row'>
                    <div className='title'>Title of the article 1...</div>
                    <span>22/02/2026 at 15:14</span>
                </div>
                <div className='row'>
                    <div className='title'>Title of the article 1...</div>
                    <span>22/02/2026 at 15:14</span>
                </div>
                <div className='row'>
                    <div className='title'>Title of the article 1...</div>
                    <span>22/02/2026 at 15:14</span>
                </div>

                <button>More news »</button>
            </div>
        </div>
    )
}

export default NewsContainer;