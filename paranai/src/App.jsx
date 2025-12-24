import './App.css'
import PhotoCard from './components/PhotoCard'
import PhotoForm from './components/PhotoForm'
import HeroSection from './components/HeroSection'
import { useState, useEffect } from 'react'

let supabase = null
try {
  const sbImport = import('./supabaseClient')
  supabase = sbImport.then(m => m.supabase)
} catch (error) {
  console.error('Failed to import supabase:', error)
}

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [userPhotos, setUserPhotos] = useState([])
  const [pendingPhoto, setPendingPhoto] = useState(null)
  const [sb, setSb] = useState(null)

  // Inicializar Supabase
  useEffect(() => {
    import('./supabaseClient')
      .then(module => {
        setSb(module.supabase)
      })
      .catch(error => {
        console.error('Error initializing supabase:', error)
      })
  }, [])

  // Cargar fotos desde Supabase y escuchar cambios en tiempo real
  useEffect(() => {
    if (!sb) return
    
    fetchPhotos()

    // Escuchar cambios en tiempo real
    try {
      const channel = sb
        .channel('photos')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'photos' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setUserPhotos(prev => [payload.new, ...prev])
            } else if (payload.eventType === 'DELETE') {
              setUserPhotos(prev => prev.filter(p => p.id !== payload.old.id))
            }
          }
        )
        .subscribe()

      return () => {
        sb.removeChannel(channel)
      }
    } catch (error) {
      console.error('Error setting up realtime:', error)
    }
  }, [sb])

  const fetchPhotos = async () => {
    if (!sb) return
    try {
      const { data, error } = await sb
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching photos:', error)
      } else {
        setUserPhotos(data || [])
      }
    } catch (error) {
      console.error('Exception fetching photos:', error)
    }
  }

  const photos = [
    { 
      id: 200, 
      title: "Día de aventuras", 
      caption: "Ese día perfecto cuando exploramos la ciudad juntas. Tu sonrisa iluminaba cada rincón que visitamos." 
    },
    { 
      id: 201, 
      title: "Momentos de risa", 
      caption: "Las carcajadas que compartimos son mi tesoro más preciado. Nadie me hace reír como tú." 
    },
    { 
      id: 202, 
      title: "Atardecer especial", 
      caption: "Viendo el atardecer mientras hablábamos de nuestros sueños. Fue mágico compartir ese momento contigo." 
    },
    { 
      id: 203, 
      title: "Celebrando juntas", 
      caption: "Cada celebración es más especial cuando estás ahí. Eres la hermana que la vida me regaló." 
    },
    { 
      id: 204, 
      title: "Aventuras culinarias", 
      caption: "Probando esa comida nueva y haciendo caras raras. Solo contigo me atrevo a ser tan espontánea." 
    },
    { 
      id: 205, 
      title: "Tarde de confidencias", 
      caption: "Hablando de todo y nada a la vez. Eres mi confidente y mi mejor amiga en una sola persona." 
    }
  ]

  const openModal = (photo) => {
    setSelectedPhoto(photo)
  }

  const closeModal = () => {
    setSelectedPhoto(null)
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPendingPhoto({
        imageUrl: imageUrl,
        fileName: file.name.split('.')[0],
        file: file
      })
    }
  }

  const handleAddPhoto = async (photoData) => {
    if (pendingPhoto && pendingPhoto.file && sb) {
      try {
        // Convertir la imagen a base64 para guardarla como Data URL
        const reader = new FileReader()
        
        reader.onload = async (e) => {
          const base64String = e.target.result

          // Guardar en Supabase
          const { data, error } = await sb
            .from('photos')
            .insert([
              {
                title: photoData.title,
                caption: photoData.caption,
                image_url: base64String
              }
            ])
            .select()

          if (error) {
            console.error('Error uploading photo:', error)
            alert('Error al subir la foto')
          } else {
            setPendingPhoto(null)
            document.getElementById('photo-upload').value = ''
          }
        }

        reader.readAsDataURL(pendingPhoto.file)
      } catch (error) {
        console.error('Error:', error)
        alert('Error al subir la foto')
      }
    }
  }

  const handleCancelPhoto = () => {
    if (pendingPhoto) {
      URL.revokeObjectURL(pendingPhoto.imageUrl)
    }
    setPendingPhoto(null)
    document.getElementById('photo-upload').value = ''
  }

  return (
    <div className="app-container">
      <HeroSection />

      <main className="app-main">

        <section className="section">
          <h2>Nuestros Momentos</h2>
          <p>
            Cada foto cuenta una historia, cada sonrisa un momento especial que compartimos.
            La distancia no puede borrar los recuerdos hermosos que hemos creado juntas.
            Este álbum es para ti, para que sepas que siempre estás presente en mi corazón.
          </p>
        </section>

        <section className="gallery-container">
          <div className="intro-section">
            <h2>Galería de Recuerdos</h2>
            <p>Momentos especiales que atesoramos juntas</p>
          </div>
          
          <div className="photos-grid">
            {[...photos, ...userPhotos].map((photo) => (
              <PhotoCard 
                key={photo.id}
                id={photo.id}
                title={photo.title}
                caption={photo.caption}
                imageUrl={photo.image_url || photo.imageUrl}
                onClick={() => openModal(photo)}
              />
            ))}
          </div>
        </section>

        <section className="section upload-section">
          <h2>Sube tus Recuerdos</h2>
          <p>
            ¿Tienes fotos especiales con Nai? ¡Compártelas aquí para crear más recuerdos juntas!
          </p>
          <div className="upload-container">
            <label htmlFor="photo-upload" className="upload-button">
              <span className="upload-icon">📸</span>
              <span>Subir Fotos</span>
              <input 
                type="file" 
                id="photo-upload" 
                accept="image/*" 
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <PhotoForm 
            pendingPhoto={pendingPhoto}
            onSubmit={handleAddPhoto}
            onCancel={handleCancelPhoto}
          />
        </section>
      </main>

      {selectedPhoto && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <img 
              src={selectedPhoto.image_url || selectedPhoto.imageUrl || `https://placekitten.com/${selectedPhoto.id}/600`}
              alt={selectedPhoto.title}
              className="modal-image"
            />
            <div className="modal-text">
              <h3>{selectedPhoto.title}</h3>
              <p>{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App