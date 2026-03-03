import './ArticlePage.css'
import articleIcon from '../../Images/articles/articleIcon.gif'
import { useEffect, useState } from 'react'
import { ArticleInterface } from '@client/Logic/Article/ArticleInterface'
import { useNavigate, useParams } from 'react-router'
import Loading from '../../Components/Loading/Loading'
import AvatarImager from '../../../../Utils/AvatarImager/AvatarImager';
import UnknowUserImage from '../../Images/unknow_user.gif';
import likeIcon from '../../Images/icons/small/like.gif';
import commentIcon from '../../Images/icons/small/comment.gif';

const ArticlePage = () => {
    const navigate = useNavigate();
    const { articleDate, articleTitle } = useParams();
    const [lastArticles, setLastArticles] = useState<Array<ArticleInterface>>([]);
    const [lastArticlesLoading, setLastArticlesLoading] = useState<boolean>(true);
    const [articleData, setArticleData] = useState<null | ArticleInterface>(null);
    const [articleDataLoading, setArticleDataLoading] = useState<boolean>(true);
    const [articleAuthorAvatar, setArticleAuthorAvatar] = useState<string | Base64URLString>(UnknowUserImage);

    useEffect(() => {
        fetch("/api/articles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                limit: 10,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.length === 0)
                    return navigate("/me");

                setLastArticles(result);
                setLastArticlesLoading(false);

                if (!articleDate || !articleTitle)
                    return navigate(`/article/${new Date(result[0].createdAt).getTime()}/${encodeURI(result[0].title)}`);
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch lasts articles:", e)
            })
    }, []);

    useEffect(() => {
        if (!articleDate || !articleTitle)
            return;

        fetch("/api/articles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: articleDate,
                title: articleTitle
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error)
                    navigate("/community")
                else {
                    if (result.author) {
                        AvatarImager(result.author.figureConfiguration).then((avatarData: Base64URLString) => {
                            setArticleAuthorAvatar(avatarData);
                            setArticleData(result);
                            setArticleDataLoading(false);
                        }).catch((e: any) => {
                            setArticleData(result);
                            setArticleDataLoading(false);
                            console.log("Failed to load avatar image:", e);
                        });
                    } else {
                        setArticleData(result);
                        setArticleDataLoading(false);
                    }
                }
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch article data:", e)
            })
    }, [navigate])

    return (
        <div className="articlePage resize">
            <div className='grid first_medium'>
                <div className='grid_row'>
                    {lastArticlesLoading ?
                        <Loading />
                        :
                        <div className='articleList'>
                            <div className='title'><span><img src={articleIcon} alt="Article Icon" /> Last articles</span></div>

                            {lastArticles.map((article) => {
                                return (
                                    <div className='row' onClick={() => navigate(`/article/${new Date(article.createdAt).getTime()}/${encodeURI(article.title)}`)} key={article.id}>
                                        <div className='content'>
                                            <div className='articleTitle'>{article.title}</div>

                                            <div className='author'>
                                                <div className='username'>{article.author && article.author.name}</div>
                                                <div className='date'>{new Date(article.createdAt).toLocaleString().replace(" ", " at ")}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>

                <div className='grid_row'>
                    {articleDataLoading ?
                        <Loading />
                        :
                        <div className='box articleContent'>
                            {articleData &&
                                <div>
                                    <div className='title'>{articleData.title}</div>
                                    <div className='content' dangerouslySetInnerHTML={{ __html: articleData.content }}></div>
                                    <div className='footer'>
                                        {articleData.author &&
                                            <div className='author'>
                                                <div className='avatar'>
                                                    <img src={articleAuthorAvatar} alt="Avatar" />
                                                </div>

                                                <div className='data'>
                                                    <div className='username'>{articleData.author.name}</div>
                                                    <div className='date'>{new Date(articleData.createdAt).toLocaleString().replace(" ", " at ")}</div>
                                                </div>
                                            </div>
                                        }

                                        <div className='infos'>
                                            <div className='row'><img src={likeIcon} alt="Like Icon" /> 0</div>
                                            <div className='row'><img src={commentIcon} alt="Comment Icon" /> 0</div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ArticlePage;