import { useState } from 'react'
import ExamPreview from './ExamPreview'
import StudentAssign from './StudentAssign'
import ProgressBar from './ProgressBar'
import ResultsDashboard from './ResultsDashboard'
import './ExamUploader.css'

export default function ExamUploader() {
  const [step, setStep] = useState('upload') // upload, preview, assign, processing, results
  const [photos, setPhotos] = useState([])
  const [students, setStudents] = useState([])
  const [results, setResults] = useState([])
  const [progress, setProgress] = useState(0)

  const handlePhotosSelected = (files) => {
    const photoArray = Array.from(files).map((file, index) => ({
      id: index,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      confidence: null,
    }))
    setPhotos([...photos, ...photoArray])
    setStep('preview')
  }

  const handlePreviewConfirm = () => {
    setStep('assign')
  }

  const handleStudentAssign = (studentList) => {
    setStudents(studentList)
    processExams(studentList)
  }

  const processExams = async (studentList) => {
    setStep('processing')
    
    // Simulación del procesamiento (backend está en desarrollo)
    // En producción, esto llamaría al backend FastAPI
    for (let i = 0; i < photos.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProgress(Math.round(((i + 1) / photos.length) * 100))

      // Simular resultado de procesamiento
      setResults(prev => [...prev, {
        studentId: i,
        studentName: studentList[i] || `Estudiante ${i + 1}`,
        score: Math.floor(Math.random() * 21),
        feedback: "Respuesta bien estructurada. Cita correctamente el criterio X.",
        level: ['en_inicio', 'en_proceso', 'logrado', 'destacado'][Math.floor(Math.random() * 4)],
      }])
    }
    
    setStep('results')
  }

  const handleReset = () => {
    setStep('upload')
    setPhotos([])
    setStudents([])
    setResults([])
    setProgress(0)
  }

  const handleRemovePhoto = (id) => {
    setPhotos(photos.filter(p => p.id !== id))
  }

  return (
    <div className="exam-uploader">
      {/* Header */}
      <header className="header">
        <h1>Ñawi</h1>
        <p className="subtitle">Evaluación Inteligente de Exámenes en Papel</p>
      </header>

      {/* Content based on current step */}
      <main className="content">
        {step === 'upload' && (
          <UploadStep onPhotosSelected={handlePhotosSelected} />
        )}

        {step === 'preview' && (
          <ExamPreview
            photos={photos}
            onConfirm={handlePreviewConfirm}
            onRemove={handleRemovePhoto}
            onBack={() => {
              setPhotos([])
              setStep('upload')
            }}
          />
        )}

        {step === 'assign' && (
          <StudentAssign
            photoCount={photos.length}
            onAssign={handleStudentAssign}
            onBack={() => setStep('preview')}
          />
        )}

        {step === 'processing' && (
          <ProgressBar
            progress={progress}
            processedCount={results.length}
            totalCount={photos.length}
          />
        )}

        {step === 'results' && (
          <ResultsDashboard
            results={results}
            students={students}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Hackathon NEXIA 2026 — Arequipa</p>
      </footer>
    </div>
  )
}

function UploadStep({ onPhotosSelected }) {
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onPhotosSelected(e.target.files)
    }
  }

  return (
    <div className="step upload-step">
      <div className="upload-zone">
        <input
          type="file"
          id="photo-input"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="file-input"
        />
        <label htmlFor="photo-input" className="upload-label">
          <div className="upload-icon">📸</div>
          <h2>Subir Exámenes</h2>
          <p>Toca aquí para subir fotos de exámenes (hasta 30)</p>
          <span className="hint">Desde galería o cámara</span>
        </label>
      </div>
      
      <div className="info-box">
        <h3>💡 Consejos:</h3>
        <ul>
          <li>Una foto por examen</li>
          <li>Buena iluminación y letra clara</li>
          <li>Máximo 30 exámenes por lote</li>
        </ul>
      </div>
    </div>
  )
}
