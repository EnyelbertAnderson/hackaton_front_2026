import { calculatePercentage, getStudentScore, getWeaknesses } from '../utils/evaluation'

export default function StudentDetail({ student, maxScore }) {
  const weaknesses = getWeaknesses(student)

  return (
    <article className="student-detail">
      <div className="student-heading">
        <div>
          <p className="eyebrow">Ficha individual</p>
          <h4>{student.name}</h4>
        </div>
        <span className={`risk ${String(student.risk || '').toLowerCase()}`}>
          Riesgo {student.risk || 'N/A'}
        </span>
      </div>

      <div className="ai-grade">
        <div>
          <span>Nota asignada por IA</span>
          <strong>{getStudentScore(student)}<small>/{maxScore}</small></strong>
        </div>
        <p>
          {student.gradingReason ||
            student.scoreReason ||
            'Calificacion calculada a partir de la respuesta, la rubrica y el puntaje maximo definido por el docente.'}
        </p>
      </div>

      <dl>
        <div>
          <dt>Nivel</dt>
          <dd>{student.level || 'Sin nivel'}</dd>
        </div>
        <div>
          <dt>Porcentaje</dt>
          <dd>{calculatePercentage(getStudentScore(student), maxScore)}%</dd>
        </div>
      </dl>

      <h5>Retroalimentacion</h5>
      <p>{student.feedback}</p>
      <h5>Evidencia detectada</h5>
      <p>{student.evidence || 'Sin evidencia textual disponible.'}</p>
      <h5>En lo que necesita apoyo</h5>
      <div className="weakness-list">
        {weaknesses.map((weakness) => <span key={weakness}>{weakness}</span>)}
        {!weaknesses.length && <span>Sin dificultad detectada</span>}
      </div>
      <h5>Proyeccion de aprendizaje</h5>
      <p>{student.projection || 'Se generara cuando existan suficientes evidencias del estudiante.'}</p>
    </article>
  )
}
