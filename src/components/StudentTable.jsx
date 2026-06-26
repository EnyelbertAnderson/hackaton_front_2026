import { getStatusClass, getStudentScore, getWeaknesses } from '../utils/evaluation'

export default function StudentTable({ students, maxScore, bimester, selectedIndex, onSelect }) {
  return (
    <div className="roster-section">
      <div className="subsection-heading">
        <div>
          <p className="eyebrow">Vista del salon</p>
          <h4>Estado de todos los estudiantes</h4>
        </div>
        <span>{bimester}</span>
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
            {students.map((student, index) => (
              <tr key={`${student.name}-row-${index}`} className={selectedIndex === index ? 'selected' : ''}>
                <td><strong>{student.name}</strong></td>
                <td>{getStudentScore(student)}/{maxScore}</td>
                <td><span className={`status-badge ${getStatusClass(student)}`}>{student.level || 'Sin estado'}</span></td>
                <td>{getWeaknesses(student).join(', ') || 'Sin dificultad detectada'}</td>
                <td>
                  <button className="table-action" onClick={() => onSelect(index)}>
                    Ver ficha
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
