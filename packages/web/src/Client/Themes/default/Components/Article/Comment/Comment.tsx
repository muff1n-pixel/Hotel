import { ArticleCommentInterface } from '@client/Logic/Article/Comment/ArticleCommentInterface';
import UnknowUserImage from '../../../Images/unknow_user.gif'
import './Comment.css';
import { useContext, useEffect, useState } from 'react';
import AvatarImager from '../../../../../Utils/AvatarImager/AvatarImager';
import likeIcon from '../../../Images/icons/small/favorite.gif';
import likeInactiveIcon from '../../../Images/icons/small/favorite_inactive.gif';
import { ThemeContext } from '../../../ThemeProvider';
import { ArticleInterface } from '@client/Logic/Article/ArticleInterface';
import TimeAgo from '../../../../../Utils/DateFormatter/DateFormatter';

interface ArticleCommentProps extends ArticleCommentInterface {
    setArticleData: React.Dispatch<React.SetStateAction<ArticleInterface | null>>;
}

const ArticleComment = (props: ArticleCommentProps) => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [userAvatar, setUserAvatar] = useState<string | Base64URLString>(UnknowUserImage);

    useEffect(() => {
        if (!props || !props.user)
            return;

        AvatarImager(props.user.figureConfiguration).then((avatarData: Base64URLString) => {
            setUserAvatar(avatarData);
        }).catch((e: any) => {
            console.log("Failed to load avatar image:", e);
        });
    }, []);

    const toggleLike = () => {
        if (!currentUser)
            return;

        fetch("/api/articles/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commentId: props.id
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error)
                    console.log("(Error) Can't like article:", result.error)
                else {
                    props.setArticleData((prev) => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            comments: prev.comments.map((comment) =>
                                comment.id === props.id
                                    ? { ...comment, likes: result }
                                    : comment
                            )
                        };
                    });
                }
            })
            .catch((e) => {
                console.log("(Error) Can't like article:", e)
            })
    }

    return (
        <div className="comment">
            <div className="user">
                <div className='avatar'>
                    <img alt="Avatar" src={userAvatar} />
                </div>
                <div className="username">{props.user ? props.user.name : "Undefined"}</div>
            </div>

            <div className='comment_container'>
                <div className="content">
                    {props.content}
                    <div className="footer">
                        <div className="date">{TimeAgo(props.createdAt)}</div>
                        <div className="infos">
                            <div className='row' onClick={() => toggleLike()}><img src={currentUser === null || !props.likes.includes(currentUser.id) ? likeInactiveIcon : likeIcon} alt="Like Icon" /> {props.likes.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleComment;