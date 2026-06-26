import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const initialForm = {
  course: 'Matematica',
  grade: '5to de secundaria',
  section: 'A',
  topic: 'Resolucion de problemas',
  competency: 'Resuelve problemas de cantidad',
  bimester: 'Bimestre 2',
  evidenceType: 'Examen bimestral',
  maxScore: 20,
  rubricNotes: 'Usar la escala vigesimal y priorizar retroalimentacion formativa.',
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
  tracking: {
    previousPeriod: 'Bimestre 1',
    currentPeriod: 'Bimestre 2',
    previousAverage: 12.9,
    currentAverage: 14.8,
    change: 1.9,
    effectiveness: 'Mejora moderada',
    intervention:
      'Aplicar lectura guiada del problema, modelado de procedimientos y una practica corta de verificacion al cierre.',
    projection:
      'Si se mantiene el refuerzo, el salon podria alcanzar un promedio de 16.1 en el siguiente bimestre.',
  },
  students: [
    {
      name: 'Ana Torres',
      score: 17,
      level: 'Logrado',
      risk: 'Bajo',
      gradingReason: 'Cumple los criterios principales de la rubrica y desarrolla correctamente el procedimiento.',
      feedback:
        'Comprende el problema y llega a una respuesta correcta. Puede mejorar explicando con mas detalle por que eligio el procedimiento.',
      evidence: 'Procedimiento correcto con justificacion parcial.',
      weaknesses: ['Justificacion del procedimiento'],
      projection: 'Puede consolidar el nivel destacado si explicita la estrategia usada.',
      trend: 'Mejora',
    },
    {
      name: 'Luis Quispe',
      score: 11,
      level: 'En proceso',
      risk: 'Medio',
      gradingReason: 'Reconoce los datos, pero el procedimiento y la justificacion estan incompletos.',
      feedback:
        'Reconoce algunos datos, pero el procedimiento queda incompleto. Conviene revisar como traducir el enunciado a una operacion.',
      evidence: 'Identifica datos, pero omite la verificacion final.',
      weaknesses: ['Comprension del enunciado', 'Eleccion de la operacion', 'Verificacion'],
      projection: 'Requiere acompanamiento focalizado para alcanzar el nivel esperado.',
      trend: 'En observacion',
    },
    {
      name: 'Maria Huaman',
      score: 16,
      level: 'Logrado',
      risk: 'Bajo',
      gradingReason: 'La respuesta es coherente y cumple la rubrica, con un error menor de calculo.',
      feedback:
        'Presenta una solucion clara y ordenada. Debe cuidar pequenos errores de calculo para sostener el resultado.',
      evidence: 'Respuesta coherente con error menor de calculo.',
      weaknesses: ['Precision en el calculo'],
      projection: 'Tiene alta probabilidad de mejorar si incorpora una revision final.',
      trend: 'Mejora',
    },
  ],
}

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
    const limitedFiles = selected.slice(0, 30)
    setFiles(limitedFiles)
    setResults(null)
    setError('')
  }

  const handleRubricFile = (event) => {
    const [selectedFile] = Array.from(event.target.files || [])

    if (!selectedFile) {
      setRubricFile(null)
      return
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const allowedExtensions = ['.pdf', '.doc', '.docx']
    const hasAllowedExtension = allowedExtensions.some((extension) =>
      selectedFile.name.toLowerCase().endsWith(extension),
    )

    if (!allowedTypes.includes(selectedFile.type) && !hasAllowedExtension) {
      setRubricFile(null)
      setError('La rubrica debe estar en formato PDF, DOC o DOCX.')
      return
    }

    setRubricFile(selectedFile)
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
      bimester: form.bimester,
      evidenceType: form.evidenceType,
      maxScore: Number(form.maxScore),
      students: studentNames,
    }))
    payload.append('rubricFile', rubricFile)
    payload.append('rubricNotes', form.rubricNotes)
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

    if (!rubricFile) {
      setError('Sube la rubrica en PDF o Word antes de procesar.')
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
  const tracking = results?.tracking
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
          <a href="#seguimiento">Seguimiento</a>
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

          <div className="field-grid field-grid--two">
            <Field
              label="Periodo"
              value={form.bimester}
              options={['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4']}
              onChange={(value) => updateField('bimester', value)}
            />
            <Field
              label="Tipo de evidencia"
              value={form.evidenceType}
              options={['Examen bimestral', 'Practica', 'Tarea', 'Proyecto']}
              onChange={(value) => updateField('evidenceType', value)}
            />
          </div>

          <Field label="Tema evaluado" value={form.topic} onChange={(value) => updateField('topic', value)} />
          <Field label="Competencia curricular" value={form.competency} onChange={(value) => updateField('competency', value)} />

          <label className="rubric-upload" htmlFor="rubric-file">
            <input
              id="rubric-file"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleRubricFile}
            />
            <span>Rubrica en PDF o Word</span>
            <strong>{rubricFile ? rubricFile.name : 'Seleccionar archivo de rubrica'}</strong>
            <small>{rubricFile ? formatFileSize(rubricFile.size) : 'Formatos permitidos: PDF, DOC o DOCX'}</small>
          </label>

          <label className="textarea-field">
            <span>Indicaciones adicionales para la IA</span>
            <textarea value={form.rubricNotes} onChange={(event) => updateField('rubricNotes', event.target.value)} rows="3" />
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
            <p>{files.length} imagen(es), {studentNames.length} estudiante(s), {rubricFile ? 'rubrica lista' : 'falta rubrica'}.</p>
          </div>
        </section>

        <section id="diagnostico" className="panel dashboard-panel">
          <div className="section-title">
            <span>3</span>
            <div>
              <h3>Calificacion y diagnostico</h3>
              <p>La IA revisa cada examen con la rubrica y asigna una nota sobre el puntaje maximo del profesor.</p>
            </div>
          </div>

          {!results && (
            <div className="empty-state">
              <strong>Esperando resultados</strong>
              <p>Procesa los examenes para obtener la nota calculada por IA, el diagnostico y la retroalimentacion.</p>
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

              <div className="roster-section">
                <div className="subsection-heading">
                  <div>
                    <p className="eyebrow">Vista del salon</p>
                    <h4>Estado de todos los estudiantes</h4>
                  </div>
                  <span>{form.bimester}</span>
                </div>

                <div className="table-scroll">
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Nota</th>
                        <th>Estado</th>
                        <th>En lo que falla</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentResults.map((student, index) => (
                        <tr key={`${student.name}-row-${index}`} className={selectedStudent === index ? 'selected' : ''}>
                          <td><strong>{student.name}</strong></td>
                          <td>{getStudentScore(student)}/{form.maxScore}</td>
                          <td><span className={`status-badge ${getStatusClass(student)}`}>{student.level || 'Sin estado'}</span></td>
                          <td>{getWeaknesses(student).join(', ') || 'Sin dificultad detectada'}</td>
                          <td>
                            <button className="table-action" onClick={() => setSelectedStudent(index)}>
                              Ver ficha
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                      <strong>{getStudentScore(student)}/{form.maxScore}</strong>
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

                    <div className="ai-grade">
                      <div>
                        <span>Nota asignada por IA</span>
                        <strong>{getStudentScore(activeStudent)}<small>/{form.maxScore}</small></strong>
                      </div>
                      <p>
                        {activeStudent.gradingReason ||
                          activeStudent.scoreReason ||
                          'Calificacion calculada a partir de la respuesta, la rubrica y el puntaje maximo definido por el docente.'}
                      </p>
                    </div>

                    <dl>
                      <div>
                        <dt>Nivel</dt>
                        <dd>{activeStudent.level || 'Sin nivel'}</dd>
                      </div>
                      <div>
                        <dt>Porcentaje</dt>
                        <dd>{calculatePercentage(getStudentScore(activeStudent), form.maxScore)}%</dd>
                      </div>
                    </dl>
                    <h5>Retroalimentacion</h5>
                    <p>{activeStudent.feedback}</p>
                    <h5>Evidencia detectada</h5>
                    <p>{activeStudent.evidence || 'Sin evidencia textual disponible.'}</p>
                    <h5>En lo que necesita apoyo</h5>
                    <div className="weakness-list">
                      {getWeaknesses(activeStudent).map((weakness) => (
                        <span key={weakness}>{weakness}</span>
                      ))}
                      {!getWeaknesses(activeStudent).length && <span>Sin dificultad detectada</span>}
                    </div>
                    <h5>Proyeccion de aprendizaje</h5>
                    <p>{activeStudent.projection || 'Se generara cuando existan suficientes evidencias del estudiante.'}</p>
                  </article>
                )}
              </div>

              <section id="seguimiento" className="tracking-section">
                <div className="subsection-heading">
                  <div>
                    <p className="eyebrow">Ciclo de mejora</p>
                    <h4>Seguimiento bimestral del salon</h4>
                  </div>
                  <span>{tracking?.effectiveness || 'Primera medicion'}</span>
                </div>

                <div className="period-comparison">
                  <article>
                    <span>{tracking?.previousPeriod || 'Periodo anterior'}</span>
                    <strong>{tracking?.previousAverage ?? '-'}</strong>
                    <small>Promedio anterior</small>
                  </article>
                  <article className="current-period">
                    <span>{tracking?.currentPeriod || form.bimester}</span>
                    <strong>{tracking?.currentAverage ?? classroom?.averageScore ?? '-'}</strong>
                    <small>Promedio actual</small>
                  </article>
                  <article>
                    <span>Cambio observado</span>
                    <strong>{formatChange(tracking?.change)}</strong>
                    <small>Impacto de la estrategia</small>
                  </article>
                </div>

                <div className="tracking-notes">
                  <article>
                    <h5>Accion propuesta para el salon</h5>
                    <p>{tracking?.intervention || classroom?.recommendation || 'Pendiente de generar con el historial del aula.'}</p>
                  </article>
                  <article>
                    <h5>Proyeccion siguiente bimestre</h5>
                    <p>{tracking?.projection || 'La IA proyectara el avance cuando compare al menos dos periodos.'}</p>
                  </article>
                </div>
              </section>
            </>
          )}
        </section>
      </section>
    </main>
  )
}

function Field({ label, value, onChange, type = 'text', options }) {
  return (
    <label className="text-field">
      <span>{label}</span>
      {options ? (
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
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
    tracking: data.tracking || data.progress || data.bimesterComparison || null,
  }
}

function getStudentScore(student) {
  return student?.score ?? student?.aiScore ?? student?.grade ?? student?.earnedPoints ?? '-'
}

function calculatePercentage(score, maxScore) {
  const numericScore = Number(score)
  const numericMaxScore = Number(maxScore)

  if (Number.isNaN(numericScore) || !numericMaxScore) {
    return 0
  }

  return Math.round((numericScore / numericMaxScore) * 100)
}

function getWeaknesses(student) {
  const weaknesses = student?.weaknesses ?? student?.difficulties ?? student?.errors ?? []

  if (Array.isArray(weaknesses)) {
    return weaknesses.map((item) => typeof item === 'string' ? item : item.label).filter(Boolean)
  }

  return weaknesses ? [String(weaknesses)] : []
}

function getStatusClass(student) {
  const level = String(student?.level || '').toLowerCase()

  if (level.includes('inicio') || level.includes('riesgo')) return 'needs-support'
  if (level.includes('proceso')) return 'in-progress'
  return 'achieved'
}

function formatChange(change) {
  const numericChange = Number(change)
  if (Number.isNaN(numericChange)) return '-'
  return `${numericChange > 0 ? '+' : ''}${numericChange}`
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default App
