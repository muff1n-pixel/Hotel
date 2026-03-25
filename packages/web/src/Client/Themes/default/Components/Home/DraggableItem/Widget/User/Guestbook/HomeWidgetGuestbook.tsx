import { useContext, useEffect, useState } from "react";
import { HomeUserType, GuestbookMessage } from "../../../../../../Pages/HomePage/HomePage";
import HomeWidgetPagination from "../../Pagination/HomeWidgetPagination";
import { ThemeContext } from "../../../../../../ThemeProvider";
import './HomeWidgetGuestbook.css';
import Button from "../../../../../Button/Button";
import HomeWidgetGuestbookMessage from "./Message/HomeWidgetGuestbookMessage";

type HomeWidgetGuestbookProps = {
    activeUser: HomeUserType,
    borderSkin: string | null,
    recalculatePosition: () => void;
}

export const HomeWidgetGuestbook = ({ activeUser, borderSkin, recalculatePosition }: HomeWidgetGuestbookProps) => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [guestbookMessages, setGuestbookMessages] = useState<Array<GuestbookMessage>>([...activeUser.guestbookMessages])
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const ITEMS_PER_PAGE = 3;
    const [page, setPage] = useState(1);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const showingMessages = guestbookMessages.slice(start, end);
    const totalPages = Math.ceil(guestbookMessages.length / ITEMS_PER_PAGE);

    useEffect(() => {
        recalculatePosition();
    }, [error, guestbookMessages]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/home/guestbook/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    homeId: activeUser.id,
                    message
                })
            });

            const result = await res.json();

            if (result.error) {
                console.error('Error sending message: ' + result.error);
                setError(result.error);
                return;
            }

            setError(null);
            setMessage('');
            setGuestbookMessages((prev) => [
                result,
                ...prev
            ]);

        } catch (err) {
            setError('An error occured.');
            console.error('Error sending message:', err);
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            const res = await fetch('/api/home/guestbook/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messageId: id
                })
            });

            const result = await res.json();

            if (result.error) {
                console.error('Error deleting message: ' + result.error);
                setError(result.error);
                return;
            }

            setError(null);
            setGuestbookMessages((prev) =>
                prev.filter((msg) => msg.id !== id)
            );

        } catch (err) {
            setError('An error occured.');
            console.error('Error deleting message:', err);
        }
    }

    return (
        <div className={`guestbookWidget widget skin ${borderSkin}`}>
            <div className="widgetCorner">
                <div className="widgetHeadline">
                    <div className='widgetTitle'>Guestbook</div>
                </div>
            </div>

            <div className="widgetBody">
                <div className="widgetContent">
                    {currentUser &&
                        <>
                            {error && <div className="error">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <textarea
                                    placeholder="Your message..."
                                    maxLength={200}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter')
                                            e.preventDefault()
                                    }}
                                />
                                <Button color="grey">Send message {message.length > 0 && `(${message.length}/200)`}</Button>
                            </form>
                        </>
                    }
                    {guestbookMessages.length === 0 ?
                        <div className="noMessages">No messages yet.</div>
                        :
                        <div className="messages">
                            {
                                showingMessages.map((message) => {
                                    return (
                                        <HomeWidgetGuestbookMessage key={message.id} message={message} activeUser={activeUser} deleteMessage={deleteMessage} />
                                    )
                                })
                            }
                        </div>
                    }

                    {totalPages > 1 &&
                        <HomeWidgetPagination
                            page={page}
                            totalPages={totalPages}
                            onPrev={() => setPage(page - 1)}
                            onNext={() => setPage(page + 1)}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default HomeWidgetGuestbook;