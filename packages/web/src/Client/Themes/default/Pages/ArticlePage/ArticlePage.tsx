import './ArticlePage.css'
import articleIcon from '../../Images/articles/articleIcon.gif'

const ArticlePage = () => {
    return (
        <div className="articlePage resize">
            <div className='grid first_medium'>
                <div className='grid_row'>
                    <div className='articleList'>
                        <div className='title'><span><img src={articleIcon} alt="Article Icon" /> Last articles</span></div>

                        <div className='row'>
                            <div className='content'>
                                <div className='articleTitle'>The title of the article ZZ ZZ ZZ ZZ</div>

                                <div className='author'>
                                    <div className='username'>Author</div>
                                    <div className='date'>16/02/2026</div>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='content'>
                                <div className='articleTitle'>The title of the article ZZ ZZ ZZ ZZ</div>

                                <div className='author'>
                                    <div className='username'>Author</div>
                                    <div className='date'>16/02/2026</div>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='content'>
                                <div className='articleTitle'>The title of the article ZZ ZZ ZZ ZZ</div>

                                <div className='author'>
                                    <div className='username'>Author</div>
                                    <div className='date'>16/02/2026</div>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='content'>
                                <div className='articleTitle'>The title of the article ZZ ZZ ZZ ZZ</div>

                                <div className='author'>
                                    <div className='username'>Author</div>
                                    <div className='date'>16/02/2026</div>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='content'>
                                <div className='articleTitle'>The title of the article ZZ ZZ ZZ ZZ</div>

                                <div className='author'>
                                    <div className='username'>Author</div>
                                    <div className='date'>16/02/2026</div>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='content'>
                                <div className='articleTitle'>The title of the article ZZ ZZ ZZ ZZ</div>

                                <div className='author'>
                                    <div className='username'>Author</div>
                                    <div className='date'>16/02/2026</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid_row'>
                    <div className='box articleContent'>
                        <div className='title'>The article name...</div>
                        <div className='content'>
                            In bibendum purus eget ex efficitur, sed ultricies purus viverra. Curabitur tempus luctus lectus, quis ullamcorper ex malesuada sed. Morbi accumsan aliquet suscipit. Pellentesque pellentesque dolor vitae consequat porttitor. Integer quis tristique sapien. Pellentesque pellentesque, orci ut commodo tempus, erat magna accumsan urna, eu facilisis mi lacus a ex. Aenean dignissim iaculis nisl, nec hendrerit libero finibus at. Maecenas pharetra sit amet justo id tempus. Nullam at ultricies lacus. Morbi pretium lectus nec massa consectetur sollicitudin. Nunc pharetra orci sit amet imperdiet porttitor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean placerat ex vel neque faucibus sodales. Fusce scelerisque elit dui, eu gravida urna finibus in. Nunc vel sapien laoreet, imperdiet orci mattis, elementum magna. Cras metus erat, tincidunt et odio sit amet, viverra viverra lorem.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticlePage;