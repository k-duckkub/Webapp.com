export function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < full ? '#FACC15' : i === full && half ? '#FACC15' : '#3a3530', fontSize: 11 }}>
            {i < full ? '★' : i === full && half ? '½' : '★'}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 10, color: '#7a7060' }}>({reviews})</span>
    </div>
  )
}
