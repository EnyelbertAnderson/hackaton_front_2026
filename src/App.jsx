import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const initialForm = {
  course: 'Matematica',
  grade: '5to de secundaria',
  section: 'A',
  topic: 'Resolucion de problemas',
  competency: 'Resuelve problemas de cantidad',
  maxScore: 20,
  rubric: 'Identifica los datos del problema: 4 pts\nPlantea un procedimiento correcto: 6 pts\nResuelve operaciones con precision: 6 pts\nExplica la respuesta con claridad: 4 pts',
  students: 'Ana Torres\nLuis Quispe\nMaria Huaman',
}

const sampleResponse = {
  classroom: {
    averageScore: 14.8,
    passRate: 78,
    processedExams: 3,
    weakCompetencies: ['Argumentacion matematica', 'Comprension del enunciado'],
    commonErrors: [
      { label: 'Confunde datos relevantes con distractores', count: 2 },
      { label: 'No justifica el procedimiento', count: 2 },
      { label: 'Errores en operaciones con fracciones', count: 1 },
    ],
    recommendation:
      'Reforzar lectura del enunciado antes de operar y resolver un ejercicio guiado donde se explicite cada paso del procedimiento.',
  },
  students: [
    {
      name: 'Ana Torres',
      score: 17,
      level: 'Logrado',
      risk: 'Bajo',
      feedback:
        'Comprende el problema y llega a una respuesta correcta. Puede mejorar explicando con mas detalle por que eligio el procedimiento.',
      evidence: 'Procedimiento correcto con justificacion parcial.',
    },
    {
      name: 'Luis Quispe',
      score: 11,
      level: 'En proceso',
      risk: 'Medio',
      feedback:
        'Reconoce algunos datos, pero el procedimiento queda incompleto. Conviene revisar como traducir el enunciado a una operacion.',
      evidence: 'Identifica datos, pero omite la verificacion final.',
    },
    {
      name: 'Maria Huaman',
      score: 16,
      level: 'Logrado',
      risk: 'Bajo',
      feedback:
        'Presenta una solucion clara y ordenada. Debe cuidar pequenos errores de calculo para sostener el resultado.',
      evidence: 'Respuesta coherente con error menor de calculo.',
    },
  ],
}

function App() {
  const [files, setFiles] = useState([])
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
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  )

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [previews])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || [])
    setFiles(selected.slice(0, 30))
    setResults(null)
    setError('')
  }

  const buildPayload = () => {
    const payload = new FormData()
    files.forEach((file) => payload.append('files', file))
    payload.append('metadata', JSON.stringify({
      course: form.course,
      grade: form.grade,
      section: form.section,
      topic: form.topic,
      competency: form.competency,
      maxScore: Number(form.maxScore),
      students: studentNames,
    }))
    payload.append('rubric', form.rubric)
    return payload
  }

  const processEvaluation = async () => {
    if (!files.length) {
      setError('Sube al menos una foto de examen.')
      return
    }

    if (studentNames.length !== files.length) {
      setError(`Ingresa ${files.length} estudiante(s), uno por cada foto.`)
      return
    }

    setStatus('loading')
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/evaluations/process`, {
        method: 'POST',
        body: buildPayload(),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || `Error ${response.status}`)
      }

      const data = await response.json()
      setResults(normalizeResults(data))
      setSelectedStudent(0)
      setStatus('success')
    } catch (requestError) {
      setStatus('error')
      setError(`No se pudo conectar con el backend. ${requestError.message}`)
    }
  }

  const loadDemo = () => {
    setResults(sampleResponse)
    setStatus('success')
    setError('')
  }

  const classroom = results?.classroom
  const studentResults = results?.students || []
  const activeStudent = studentResults[selectedStudent]

  return (
    <main className="nawi-app">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Inteligencia pedagogica</p>
          <h1>Nawi</h1>
          <p className="lede">
            Convierte examenes manuscritos en evidencias, retroalimentacion y decisiones para la siguiente clase.
          </p>
        </div>

        <nav className="flow">
          <a href="#captura">Captura</a>
          <a href="#rubrica">Rubrica</a>
          <a href="#diagnostico">Diagnostico</a>
        </nav>

        <div className="api-card">
          <span>Backend</span>
          <strong>{API_BASE_URL}</strong>
          <small>Configura VITE_API_URL para apuntar a tu API.</small>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Hackathon NEXIA 2026</p>
            <h2>Panel docente</h2>
          </div>
          <button className="ghost-button" onClick={loadDemo}>Ver ejemplo</button>
        </header>

        <section id="captura" className="panel capture-panel">
          <div className="section-title">
            <span>1</span>
            <div>
              <h3>Captura de examenes</h3>
              <p>Sube una foto por estudiante. El backend recibira las imagenes como FormData.</p>
            </div>
          </div>

          <label className="dropzone" htmlFor="exam-files">
            <input id="exam-files" type="file" accept="image/*" multiple onChange={handleFiles} />
            <strong>Seleccionar fotografias</strong>
            <span>JPG, PNG o HEIC desde camara o galeria</span>
          </label>

          {previews.length > 0 && (
            <div className="preview-grid">
              {previews.map((preview, index) => (
                <figure key={`${preview.file.name}-${index}`}>
                  <img src={preview.url} alt={`Examen ${index + 1}`} />
                  <figcaption>Examen {index + 1}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        <section id="rubrica" className="panel form-panel">
          <div className="section-title">
            <span>2</span>
            <div>
              <h3>Datos pedagogicos</h3>
              <p>Estos campos viajan junto a las imagenes para que el backend analice con contexto.</p>
            </div>
          </div>

          <div className="field-grid">
            <Field label="Curso" value={form.course} onChange={(value) => updateField('course', value)} />
            <Field label="Grado" value={form.grade} onChange={(value) => updateField('grade', value)} />
            <Field label="Seccion" value={form.section} onChange={(value) => updateField('section', value)} />
            <Field label="Puntaje maximo" type="number" value={form.maxScore} onChange={(value) => updateField('maxScore', value)} />
          </div>

          <Field label="Tema evaluado" value={form.topic} onChange={(value) => updateField('topic', value)} />
          <Field label="Competencia curricular" value={form.competency} onChange={(value) => updateField('competency', value)} />

          <label className="textarea-field">
            <span>Rubrica</span>
            <textarea value={form.rubric} onChange={(event) => updateField('rubric', event.target.value)} rows="6" />
          </label>

          <label className="textarea-field">
            <span>Estudiantes, uno por linea</span>
            <textarea value={form.students} onChange={(event) => updateField('students', event.target.value)} rows="5" />
          </label>

          {error && <p className="error-box">{error}</p>}

          <div className="actions">
            <button className="primary-button" onClick={processEvaluation} disabled={status === 'loading'}>
              {status === 'loading' ? 'Procesando...' : 'Procesar con backend'}
            </button>
            <p>{files.length} imagen(es) listas, {studentNames.length} estudiante(s) registrados.</p>
          </div>
        </section>

        <section id="diagnostico" className="panel dashboard-panel">
          <div className="section-title">
            <span>3</span>
            <div>
              <h3>Diagnostico accionable</h3>
              <p>Renderiza las metricas, errores frecuentes y retroalimentacion que retorne la API.</p>
            </div>
          </div>

          {!results && (
            <div className="empty-state">
              <strong>Esperando resultados</strong>
              <p>Cuando el backend responda, aqui aparecera el diagnostico del aula y las fichas por estudiante.</p>
            </div>
          )}

          {results && (
            <>
              <div className="metrics">
                <Metric label="Promedio" value={classroom?.averageScore ?? '-'} suffix={`/${form.maxScore}`} />
                <Metric label="Aprobacion" value={classroom?.passRate ?? '-'} suffix="%" />
                <Metric label="Procesados" value={classroom?.processedExams ?? studentResults.length} suffix="examenes" />
              </div>

              <div className="insight-grid">
                <article className="insight-block">
                  <h4>Errores frecuentes</h4>
                  <ul>
                    {(classroom?.commonErrors || []).map((item) => (
                      <li key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.count}</strong>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="insight-block">
                  <h4>Recomendacion docente</h4>
                  <p>{classroom?.recommendation || 'Sin recomendacion disponible.'}</p>
                </article>
              </div>

              <div className="student-layout">
                <div className="student-list">
                  {studentResults.map((student, index) => (
                    <button
                      key={`${student.name}-${index}`}
                      className={selectedStudent === index ? 'active' : ''}
                      onClick={() => setSelectedStudent(index)}
                    >
                      <span>{student.name}</span>
                      <strong>{student.score}/{form.maxScore}</strong>
                    </button>
                  ))}
                </div>

                {activeStudent && (
                  <article className="student-detail">
                    <div className="student-heading">
                      <div>
                        <p className="eyebrow">Ficha individual</p>
                        <h4>{activeStudent.name}</h4>
                      </div>
                      <span className={`risk ${String(activeStudent.risk || '').toLowerCase()}`}>
                        Riesgo {activeStudent.risk || 'N/A'}
                      </span>
                    </div>
                    <dl>
                      <div>
                        <dt>Nivel</dt>
                        <dd>{activeStudent.level || 'Sin nivel'}</dd>
                      </div>
                      <div>
                        <dt>Puntaje</dt>
                        <dd>{activeStudent.score}/{form.maxScore}</dd>
                      </div>
                    </dl>
                    <h5>Retroalimentacion</h5>
                    <p>{activeStudent.feedback}</p>
                    <h5>Evidencia detectada</h5>
                    <p>{activeStudent.evidence || 'Sin evidencia textual disponible.'}</p>
                  </article>
                )}
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="text-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Metric({ label, value, suffix }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{suffix}</small>
    </article>
  )
}

function normalizeResults(data) {
  return {
    classroom: data.classroom || data.diagnosis || data.summary || {},
    students: data.students || data.results || data.evaluations || [],
  }
}

export default App
