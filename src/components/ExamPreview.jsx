export default function ExamPreview({ photos, onConfirm, onRemove, onBack }) {
  return (
    <div className="step preview-step">
      <h2>Previsualización de Exámenes</h2>
      <p className="step-info">{photos.length} foto(s) seleccionadas</p>

      <div className="thumbnails-grid">
        {photos.map((photo, idx) => (
          <div key={photo.id} className="thumbnail-item">
            <div className="thumbnail">
              <img src={photo.preview} alt={`Examen ${idx + 1}`} />
              <span className="exam-number">{idx + 1}</span>
            </div>
            <button
              className="remove-btn"
              onClick={() => onRemove(photo.id)}
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Volver
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          Continuar →
        </button>
      </div>
    </div>
  )
}
