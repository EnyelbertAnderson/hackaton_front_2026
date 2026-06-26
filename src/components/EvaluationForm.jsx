import { bimesterOptions, evidenceTypeOptions } from '../data/evaluationData'
import { formatFileSize } from '../utils/evaluation'
import Field from './Field'

export default function EvaluationForm({
  form,
  filesCount,
  rubricFile,
  studentCount,
  status,
  error,
  onFieldChange,
  onRubricChange,
  onProcess,
}) {
  return (
    <section id="rubrica" className="panel form-panel">
      <div className="section-title">
        <span>2</span>
        <div>
          <h3>Datos pedagogicos</h3>
          <p>Estos campos viajan junto a las imagenes para que el backend analice con contexto.</p>
        </div>
      </div>

      <div className="field-grid">
        <Field label="Curso" value={form.course} onChange={(value) => onFieldChange('course', value)} />
        <Field label="Grado" value={form.grade} onChange={(value) => onFieldChange('grade', value)} />
        <Field label="Seccion" value={form.section} onChange={(value) => onFieldChange('section', value)} />
        <Field label="Puntaje maximo" type="number" value={form.maxScore} onChange={(value) => onFieldChange('maxScore', value)} />
      </div>

      <div className="field-grid field-grid--two">
        <Field
          label="Periodo"
          value={form.bimester}
          options={bimesterOptions}
          onChange={(value) => onFieldChange('bimester', value)}
        />
        <Field
          label="Tipo de evidencia"
          value={form.evidenceType}
          options={evidenceTypeOptions}
          onChange={(value) => onFieldChange('evidenceType', value)}
        />
      </div>

      <Field label="Tema evaluado" value={form.topic} onChange={(value) => onFieldChange('topic', value)} />
      <Field label="Competencia curricular" value={form.competency} onChange={(value) => onFieldChange('competency', value)} />

      <label className="rubric-upload" htmlFor="rubric-file">
        <input
          id="rubric-file"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={onRubricChange}
        />
        <span>Rubrica en PDF o Word</span>
        <strong>{rubricFile ? rubricFile.name : 'Seleccionar archivo de rubrica'}</strong>
        <small>{rubricFile ? formatFileSize(rubricFile.size) : 'Formatos permitidos: PDF, DOC o DOCX'}</small>
      </label>

      <label className="textarea-field">
        <span>Indicaciones adicionales para la IA</span>
        <textarea value={form.rubricNotes} onChange={(event) => onFieldChange('rubricNotes', event.target.value)} rows="3" />
      </label>

      <label className="textarea-field">
        <span>Estudiantes, uno por linea</span>
        <textarea value={form.students} onChange={(event) => onFieldChange('students', event.target.value)} rows="5" />
      </label>

      {error && <p className="error-box">{error}</p>}

      <div className="actions">
        <button className="primary-button" onClick={onProcess} disabled={status === 'loading'}>
          {status === 'loading' ? 'Procesando...' : 'Procesar con backend'}
        </button>
        <p>{filesCount} imagen(es), {studentCount} estudiante(s), {rubricFile ? 'rubrica lista' : 'falta rubrica'}.</p>
      </div>
    </section>
  )
}
