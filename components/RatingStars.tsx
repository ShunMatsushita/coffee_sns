interface RatingStarsProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({ rating, size = 'sm' }: RatingStarsProps) {
    return (
        <span className={`rating-stars rating-stars-${size}`} aria-label={`評価: ${rating}/5`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'star-filled' : 'star-empty'}`}
                >
                    ★
                </span>
            ))}
        </span>
    );
}
