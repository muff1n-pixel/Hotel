import { useEffect, useState } from 'react';
import './ArticleContainer.css';
import Loading from '../Loading/Loading';
import { ArticleInterface } from '@client/Logic/Article/ArticleInterface';
import { useNavigate } from 'react-router';

const ArticleContainer = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [articles, setArticles] = useState<Array<ArticleInterface>>([]);
    const [activeArticleCarousel, setActiveArticleCarousel] = useState<number>(0);
    const [carouselTimer, setCarouselTimer] = useState<number>(0);

    useEffect(() => {
        fetch("/api/articles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                limit: 5,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                setArticles(result);
                setLoading(false);
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch articles:", e)
            })
    }, []);

    useEffect(() => {
        if (articles.length === 0) return;

        const carouselInterval = setInterval(() => {
            setCarouselTimer((prev) => {
                if (prev >= 9) {
                    setActiveArticleCarousel((current) =>
                        (current + 1) % Math.min(3, articles.length)
                    );
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(carouselInterval);

    }, [articles.length]);

    if (loading)
        return <Loading />
    else if (articles.length > 0) {
        return (
            <div className='articlesContainer'>
                <div className='show_banner'>
                    <div className='header'>
                        <h4>LATEST NEWS</h4>

                        {articles.length > 1 &&
                            <ul>
                                {articles.slice(0, 3).map((article, i) => {
                                    return <li key={i} className={activeArticleCarousel === i ? "active" : ""} onClick={() => {
                                        setActiveArticleCarousel(i);
                                        setCarouselTimer(0);
                                    }}></li>
                                })}
                            </ul>
                        }
                    </div>
                    {articles.slice(0, 3).map((article, i) => {
                        return (
                            <div className='show_banner_row' style={{ backgroundImage: `url(${article.bannerUrl})`, display: activeArticleCarousel === i ? "block" : "none" }} key={article.id} onClick={() => navigate(`/article/${new Date(article.createdAt).getTime()}/${encodeURI(article.title)}`)}>
                                <h2>{article.title}</h2>
                                <p>{article.content.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                                <button onClick={() => navigate(`/article/${new Date(article.createdAt).getTime()}/${encodeURI(article.title)}`)} key={article.id}>Read more »</button>
                            </div>
                        )
                    })}
                </div>

                {
                    articles.map((article) => {
                        return (
                            <div className='row' onClick={() => navigate(`/article/${new Date(article.createdAt).getTime()}/${encodeURI(article.title)}`)} key={article.id}>
                                <div className='title'>{article.title}</div>
                                <span>{new Date(article.createdAt).toLocaleString().replace(" ", " at ")}</span>
                            </div>
                        )
                    })
                }

                <button onClick={() => navigate(`/article/${new Date(articles[0].createdAt).getTime()}/${encodeURI(articles[0].title)}`)}> More news »</button>
            </div >
        )
    }
}

export default ArticleContainer;