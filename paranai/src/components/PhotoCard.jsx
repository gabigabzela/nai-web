import './PhotoCard.css'

function PhotoCard({ id, title, onClick, imageUrl }) {
  return (
    <div className="photo-item" onClick={onClick}>
      <div className="photo-frame">
        <img src={imageUrl || `https://placekitten.com/${id}/300`} alt={title} />
      </div>
      <div className="photo-caption">
        <h4>{title}</h4>
      </div>
    </div>
  )
}

export default PhotoCard