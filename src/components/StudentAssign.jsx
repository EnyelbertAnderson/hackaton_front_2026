import { useState } from 'react'

export default function StudentAssign({ photoCount, onAssign, onBack }) {
  const [studentList, setStudentList] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setStudentList(e.target.value)
    setError('')
  }

  const handleAssign = () => {
    const students = studentList
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0)

    if (students.length !== photoCount) {
      setError(`Debes ingresar exactamente ${photoCount} nombres (uno por línea)`)
      return
    }

    onAssign(students)
  }

  const handlePaste = () => {
    navigator.clipboard.read().then(items => {
      for (const item of items) {
        if (item.types.includes('text/plain')) {
          item.getType('text/plain').then(blob => {
            blob.text().then(text => {
              setStudentList(text)
            })
          })
        }
      }
    })
  }

  return (
    <div className="step assign-step">
      <h2>Asignar Estudiantes</h2>
      <p className="step-info">Ingresa los nombres de los {photoCount} estudiantes (uno por línea, en el mismo orden de las fotos)</p>

      <div className="form-group">
        <textarea
          value={studentList}
          onChange={handleChange}
          placeholder={`Nombre Estudiante 1\nNombre Estudiante 2\nNombre Estudiante 3\n...\nNombre Estudiante ${photoCount}`}
          className="student-textarea"
          rows={Math.min(photoCount + 2, 15)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button className="btn btn-outline" onClick={handlePaste}>
          📋 Pegar desde portapapeles
        </button>
      </div>

      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Volver
        </button>
        <button className="btn btn-primary" onClick={handleAssign}>
          Procesar Exámenes →
        </button>
      </div>
    </div>
  )
}
