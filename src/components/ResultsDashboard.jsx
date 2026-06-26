import { getStudentScore } from '../utils/evaluation'
import BimesterTracking from './BimesterTracking'
import StudentDetail from './StudentDetail'
import StudentTable from './StudentTable'

function Metric({ label, value, suffix }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{suffix}</small>
    </article>
  )
}

export default function ResultsDashboard({ results, maxScore, bimester, selectedStudent, onSelectStudent }) {
  const classroom = results?.classroom
  const tracking = results?.tracking
  const students = results?.students || []
  const activeStudent = students[selectedStudent]

  return (
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
            <Metric label="Promedio" value={classroom?.averageScore ?? '-'} suffix={`/${maxScore}`} />
            <Metric label="Aprobacion" value={classroom?.passRate ?? '-'} suffix="%" />
            <Metric label="Procesados" value={classroom?.processedExams ?? students.length} suffix="examenes" />
          </div>

          <div className="insight-grid">
            <article className="insight-block">
              <h4>Errores frecuentes</h4>
              <ul>
                {(classroom?.commonErrors || []).map((item, index) => {
                  const label = typeof item === 'string' ? item : item.label
                  const count = typeof item === 'string' ? '-' : item.count
                  return (
                    <li key={`${label}-${index}`}>
                      <span>{label}</span>
                      <strong>{count}</strong>
                    </li>
                  )
                })}
              </ul>
            </article>

            <article className="insight-block">
              <h4>Recomendacion docente</h4>
              <p>{classroom?.recommendation || 'Sin recomendacion disponible.'}</p>
            </article>
          </div>

          <StudentTable
            students={students}
            maxScore={maxScore}
            bimester={bimester}
            selectedIndex={selectedStudent}
            onSelect={onSelectStudent}
          />

          <div className="student-layout">
            <div className="student-list">
              {students.map((student, index) => (
                <button
                  key={`${student.name}-${index}`}
                  className={selectedStudent === index ? 'active' : ''}
                  onClick={() => onSelectStudent(index)}
                >
                  <span>{student.name}</span>
                  <strong>{getStudentScore(student)}/{maxScore}</strong>
                </button>
              ))}
            </div>

            {activeStudent && <StudentDetail student={activeStudent} maxScore={maxScore} />}
          </div>

          <BimesterTracking tracking={tracking} classroom={classroom} bimester={bimester} />
        </>
      )}
    </section>
  )
}
