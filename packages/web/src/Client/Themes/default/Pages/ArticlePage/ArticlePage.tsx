import './ArticlePage.css'
import articleIcon from '../../Images/articles/articleIcon.gif'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ArticleInterface } from '@client/Logic/Article/ArticleInterface'
import { useNavigate, useParams } from 'react-router'
import Loading from '../../Components/Loading/Loading'
import AvatarImager from '../../../../Utils/AvatarImager/AvatarImager';
import UnknowUserImage from '../../Images/unknow_user.gif';
import likeIcon from '../../Images/icons/small/favorite.gif';
import likeInactiveIcon from '../../Images/icons/small/favorite_inactive.gif';
import commentIcon from '../../Images/icons/small/comment.gif';
import arrowRight from '../../Images/icons/medium/arrow_right.gif';
import { ThemeContext } from '../../ThemeProvider'
import ArticleComment from '../../Components/Article/Comment/Comment'
import { Alert, AlertType } from '../../Components/Alert/Alert';
import { useRef } from "react";
import Box from '../../Components/Box/Box'
import TimeAgo from '../../../../Utils/DateFormatter/DateFormatter'

const ArticlePage = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { articleDate, articleTitle } = useParams();
    const fetchArticleLimit = 5;
    const [totalArticles, setTotalArticles] = useState<number>(0);
    const [lastArticles, setLastArticles] = useState<Array<ArticleInterface>>([]);
    const [lastArticlesLoading, setLastArticlesLoading] = useState<boolean>(true);

    const [articleData, setArticleData] = useState<null | ArticleInterface>(null);
    const [articleDataLoading, setArticleDataLoading] = useState<boolean>(true);
    const [articleAuthorAvatar, setArticleAuthorAvatar] = useState<string | Base64URLString>(UnknowUserImage);

    const commentsRef = useRef<HTMLDivElement | null>(null);
    const fetchCommentsLimit = 5;
    const [lastCommentsLoading, setLastCommentsLoading] = useState<boolean>(false);
    const [newCommentAlert, setNewCommentAlert] = useState<null | Alert>(null);
    const [commentContent, setCommentContent] = useState<string | undefined>(undefined);

    const fetchLastArticles = () => {
        setLastArticlesLoading(true);

        fetch("/api/articles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                limit: fetchArticleLimit,
                skip: lastArticles.length
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (lastArticles.length === 0 && result.articles.length === 0)
                    return navigate("/me");

                setTotalArticles(result.totalArticles);
                setLastArticles(lastArticles.concat(result.articles));
                setLastArticlesLoading(false);

                if (!articleDate || !articleTitle)
                    return navigate(`/article/${new Date(result.articles[0].createdAt).getTime()}/${encodeURI(result.articles[0].title)}`);
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch lasts articles:", e)
            })
    }

    useEffect(() => {
        fetchLastArticles();
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
                    setNewCommentAlert(null);
                    setCommentContent("");

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

    const toggleLike = () => {
        if (!articleData || !currentUser)
            return;

        fetch("/api/articles/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                articleId: articleData.id
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error)
                    console.log("(Error) Can't like article:", result.error)
                else {
                    setArticleData({ ...articleData, likes: result })
                }
            })
            .catch((e) => {
                console.log("(Error) Can't like article:", e)
            })
    }

    const fetchLastComments = () => {
        if (!articleData || lastCommentsLoading)
            return;

        setLastCommentsLoading(true);

        fetch("/api/articles/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                articleId: articleData.id,
                limit: fetchCommentsLimit,
                skip: articleData.comments.length
            })
        })
            .then((response) => response.json())
            .then((result) => {
                setLastCommentsLoading(false);
                setArticleData((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        comments: [...prev.comments, ...result]
                    };
                });
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch lasts articles:", e)
            })
    }

    const sendNewComment = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!articleData || !currentUser)
            return;

        fetch("/api/articles/newComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                articleId: articleData.id,
                comment: commentContent
            })
        })
            .then((response) => response.json())
            .then((result) => {

                if (result.error)
                    setNewCommentAlert({
                        type: AlertType.ERROR,
                        message: result.error
                    })
                else if (result.success) {
                    setCommentContent("");
                    setArticleData((prev) => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            comments: [result.success, ...prev.comments],
                            totalComments: prev.totalComments + 1
                        };
                    });

                    setNewCommentAlert({
                        type: AlertType.SUCCESS,
                        message: "Your comment has been published."
                    })
                }
            })
            .catch((e) => {
                setNewCommentAlert({
                    type: AlertType.ERROR,
                    message: "Impossible to call API server."
                })
            })
    }, [commentContent, setCommentContent]);

    const scrollToComments = () => {
        commentsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    return (
        <div className="articlePage resize">
            <div className='grid first_medium'>
                <div className='grid_row'>
                    {lastArticlesLoading && lastArticles.length === 0 ?
                        <Loading />
                        :
                        <div className='articleList'>
                            <div className='title'><span><img src={articleIcon} alt="Article Icon" /> Last articles</span></div>

                            {lastArticles.map((article) => {
                                return (
                                    <div className='row' onClick={() => navigate(`/article/${new Date(article.createdAt).getTime()}/${encodeURI(article.title)}`)} key={article.id}>
                                        <div className='content' style={{ backgroundImage: `url(${article.bannerUrl})` }}>
                                            <div className='articleTitle'>{article.title}</div>

                                            <div className='author'>
                                                <div className='username'>{article.author && article.author.name}</div>
                                                <div className='date'>{TimeAgo(article.createdAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {totalArticles > lastArticles.length && !lastArticlesLoading && <button className='loadMore' onClick={() => fetchLastArticles()}><img src={arrowRight} alt="Arrow Right" /> Load more</button>}
                            {lastArticlesLoading && <Loading />}
                        </div>
                    }
                </div>

                <div className='grid_row'>
                    {articleDataLoading ?
                        <Loading />
                        :
                        <div>
                            {articleData &&
                                <Box title={articleData.title} className='articleContent'>
                                    <div className='articleContentData' dangerouslySetInnerHTML={{ __html: articleData.content }}></div>
                                    <div className='footer'>
                                        {articleData.author &&
                                            <div className='author'>
                                                <div className='avatar'>
                                                    <img src={articleAuthorAvatar} alt="Avatar" />
                                                </div>

                                                <div className='data'>
                                                    <div className='username'>{articleData.author.name}</div>
                                                    <div className='date'>{TimeAgo(articleData.createdAt)} </div>
                                                </div>
                                            </div>
                                        }

                                        <div className='infos'>
                                            <div className='row' onClick={() => toggleLike()}><img src={currentUser === null || !articleData.likes.includes(currentUser.id) ? likeInactiveIcon : likeIcon} alt="Like Icon" /> {articleData.likes.length}</div>
                                            <div className='row' onClick={scrollToComments}><img src={commentIcon} alt="Comment Icon" /> {articleData.totalComments}</div>
                                        </div>
                                    </div>
                                </Box>
                            }

                            <div className='comments' ref={commentsRef}>
                                {currentUser &&
                                    <form onSubmit={sendNewComment}>
                                        {newCommentAlert && <div className={`alert ${newCommentAlert.type === AlertType.SUCCESS ? "success" : "error"}`}>{newCommentAlert.message}</div>}
                                        <textarea maxLength={1000} placeholder='Adding a new comment...' value={commentContent} onChange={(e) => setCommentContent(e.target.value)}></textarea>
                                        <button><img src={commentIcon} alt="Comment Icon" /> Send my comment</button>
                                    </form>
                                }

                                {articleData?.comments.map((comment) => {
                                    return (
                                        <ArticleComment {...comment} key={comment.id} setArticleData={setArticleData} />
                                    )
                                })}

                                {articleData && articleData.totalComments > articleData.comments.length && !lastCommentsLoading && <button className='loadMore' onClick={() => fetchLastComments()}><img src={arrowRight} alt="Arrow Right" /> Load more comments</button>}
                                {lastCommentsLoading && <Loading />}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ArticlePage;