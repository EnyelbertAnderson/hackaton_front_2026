export default function ProgressBar({ progress, processedCount, totalCount }) {
  return (
    <div className="step progress-step">
      <h2>Procesando Exámenes</h2>
      <p className="step-info">Por favor espera mientras se analizan los exámenes...</p>

      <div className="progress-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
            <span className="progress-text">{progress}%</span>
          </div>
        </div>
        <p className="progress-info">
          {processedCount} de {totalCount} exámenes procesados
        </p>
      </div>

      <div className="processing-steps">
        <div className="step-item">
          <span className="step-icon">1️⃣</span>
          <div className="step-content">
            <p className="step-title">OCR y Transcripción</p>
            <p className="step-desc">Convertir imagen a texto</p>
          </div>
        </div>
        <div className="step-item">
          <span className="step-icon">2️⃣</span>
          <div className="step-content">
            <p className="step-title">Evaluación Inteligente</p>
            <p className="step-desc">Calificar con criterios</p>
          </div>
        </div>
        <div className="step-item">
          <span className="step-icon">3️⃣</span>
          <div className="step-content">
            <p className="step-title">Verificación</p>
            <p className="step-desc">Control de calidad</p>
          </div>
        </div>
        <div className="step-item">
          <span className="step-icon">4️⃣</span>
          <div className="step-content">
            <p className="step-title">Retroalimentación</p>
            <p className="step-desc">Generar feedback</p>
          </div>
        </div>
      </div>

      <div className="loading-animation">
        <div className="spinner"></div>
      </div>
    </div>
  )
}
