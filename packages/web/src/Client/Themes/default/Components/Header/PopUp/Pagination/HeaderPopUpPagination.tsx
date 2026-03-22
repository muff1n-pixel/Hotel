type PaginationProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

const Pagination = ({ page, totalPages, onPrev, onNext }: PaginationProps) => {
    return (
        <div className="pagination">
            {page > 1 && (
                <button onClick={onPrev} className="back" />
            )}

            <div className="count">
                <span>{page}</span> / {totalPages}
            </div>

            {page < totalPages && (
                <button onClick={onNext} className="next" />
            )}
        </div>
    );
};

export default Pagination;