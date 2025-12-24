import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAb1-rgFyeJVJL_VfJJ3shMkr_d_-1mNFk",
  authDomain: "picsnai-636c1.firebaseapp.com",
  projectId: "picsnai-636c1",
  storageBucket: "picsnai-636c1.firebasestorage.app",
  messagingSenderId: "860059554170",
  appId: "1:860059554170:web:c8a5294a84f2fc8ad386c3"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Exportar servicios
export const storage = getStorage(app)
export const db = getFirestore(app)
