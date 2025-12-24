import { useState } from 'react'
import './PhotoForm.css'

function PhotoForm({ pendingPhoto, onSubmit, onCancel }) {
  const [photoTitle, setPhotoTitle] = useState(pendingPhoto?.fileName || '')
  const [photoCaption, setPhotoCaption] = useState('')

  const handleSubmit = () => {
    if (photoTitle.trim()) {
      onSubmit({
        title: photoTitle.trim(),
        caption: photoCaption.trim() || "Recuerdo especial 💕"
      })
    }
  }

  if (!pendingPhoto) return null

  return (
    <div className="photo-form-overlay" onClick={onCancel}>
      <div className="photo-form-container" onClick={(e) => e.stopPropagation()}>
        <button className="form-close" onClick={onCancel}>✕</button>
        <h3 className="form-title">Agrega los detalles de la foto</h3>
        <div className="photo-preview">
          <img src={pendingPhoto.imageUrl} alt="Preview" />
        </div>
        <div className="form-group">
          <label htmlFor="photo-title">Título de la foto</label>
          <input
            type="text"
            id="photo-title"
            value={photoTitle}
            onChange={(e) => setPhotoTitle(e.target.value)}
            placeholder="Ej: Día en la playa"
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo-description">Descripción (opcional)</label>
          <textarea
            id="photo-description"
            value={photoCaption}
            onChange={(e) => setPhotoCaption(e.target.value)}
            placeholder="Cuéntanos sobre este momento especial..."
            rows={4}
            maxLength={200}
          />
        </div>
        <div className="form-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button 
            className="btn-submit" 
            onClick={handleSubmit}
            disabled={!photoTitle.trim()}
          >
            Agregar Foto
          </button>
        </div>
      </div>
    </div>
  )
}

export default PhotoForm
