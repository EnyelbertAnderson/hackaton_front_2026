import { useEffect, useMemo, useState } from 'react'
import './App.css'
import CaptureSection from './components/CaptureSection'
import EvaluationForm from './components/EvaluationForm'
import ResultsDashboard from './components/ResultsDashboard'
import Sidebar from './components/Sidebar'
import { initialForm, sampleResponse } from './data/evaluationData'
import {
  API_BASE_URL,
  createEvaluationPayload,
  submitEvaluation,
} from './services/evaluationApi'
import { isAllowedRubric } from './utils/evaluation'

function App() {
  const [files, setFiles] = useState([])
  const [rubricFile, setRubricFile] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(0)

  const studentNames = useMemo(
    () => form.students.split('\n').map((name) => name.trim()).filter(Boolean),
    [form.students],
  )

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file), isPdf: file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') })),
    [files],
  )

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url))
  }, [previews])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleFiles = (event) => {
    setFiles(Array.from(event.target.files || []).slice(0, 30))
    setResults(null)
    setError('')
  }

  const handleRubricFile = (event) => {
    const [selectedFile] = Array.from(event.target.files || [])

    if (!selectedFile) {
      setRubricFile(null)
      return
    }

    if (!isAllowedRubric(selectedFile)) {
      setRubricFile(null)
      setError('La rubrica debe estar en formato PDF, DOC o DOCX.')
      return
    }

    setRubricFile(selectedFile)
    setResults(null)
    setError('')
  }

  const validateEvaluation = () => {
    if (!files.length) return 'Sube al menos una foto o PDF de examen.'
    if (studentNames.length !== files.length) {
      return `Ingresa ${files.length} estudiante(s), uno por cada foto.`
    }
    if (!rubricFile) return 'Sube la rubrica en PDF o Word antes de procesar.'
    return ''
  }

  const processEvaluation = async () => {
    const validationError = validateEvaluation()

    if (validationError) {
      setError(validationError)
      return
    }

    setStatus('loading')
    setError('')

    try {
      const payload = createEvaluationPayload({ files, rubricFile, form, studentNames })
      const evaluationResults = await submitEvaluation(payload)
      setResults(evaluationResults)
      setSelectedStudent(0)
      setStatus('success')
    } catch (requestError) {
      setStatus('error')
      setError(`No se pudo conectar con el backend. ${requestError.message}`)
    }
  }

  const loadDemo = () => {
    setResults(sampleResponse)
    setSelectedStudent(0)
    setStatus('success')
    setError('')
  }

  return (
    <main className="nawi-app">
      <Sidebar apiBaseUrl={API_BASE_URL} />

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Hackathon NEXIA 2026</p>
            <h2>Panel docente</h2>
          </div>
          <button className="ghost-button" onClick={loadDemo}>Ver ejemplo</button>
        </header>

        <CaptureSection previews={previews} onFilesChange={handleFiles} />

        <EvaluationForm
          form={form}
          filesCount={files.length}
          rubricFile={rubricFile}
          studentCount={studentNames.length}
          status={status}
          error={error}
          onFieldChange={updateField}
          onRubricChange={handleRubricFile}
          onProcess={processEvaluation}
        />

        <ResultsDashboard
          results={results}
          maxScore={form.maxScore}
          bimester={form.bimester}
          selectedStudent={selectedStudent}
          onSelectStudent={setSelectedStudent}
        />
      </section>
    </main>
  )
}

export default App
