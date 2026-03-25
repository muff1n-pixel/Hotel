import './HomeWidgetPagination.css'

type PaginationProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

const HomeWidgetPagination = ({ page, totalPages, onPrev, onNext }: PaginationProps) => {
    return (
        <div className="pagination">
            {page > 1 && (
                <button onClick={onPrev} className="back"><div className='chevron'></div></button>
            )}

            <div className="count">
                <span>{page}</span> / {totalPages}
            </div>

            {page < totalPages && (
                <button onClick={onNext} className="next"><div className='chevron'></div></button>
            )}
        </div>
    );
};

export default HomeWidgetPagination;