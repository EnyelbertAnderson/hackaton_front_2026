import { useState } from 'react'

export default function ResultsDashboard({ results, students, onReset }) {
  const [expandedId, setExpandedId] = useState(null)

  const getLevelColor = (level) => {
    const colors = {
      'en_inicio': '#f87171',
      'en_proceso': '#fbbf24',
      'logrado': '#4ade80',
      'destacado': '#60a5fa',
    }
    return colors[level] || '#ccc'
  }

  const getLevelLabel = (level) => {
    const labels = {
      'en_inicio': 'En Inicio',
      'en_proceso': 'En Proceso',
      'logrado': 'Logrado',
      'destacado': 'Destacado',
    }
    return labels[level] || 'N/A'
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const topErrors = [
    { error: 'Falta de coherencia en la respuesta', count: 4 },
    { error: 'Criterio X no aplicado correctamente', count: 3 },
    { error: 'Respuesta incompleta', count: 2 },
  ]

  const avgScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
  const passCount = results.filter(r => r.score >= 11).length
  const passRate = Math.round((passCount / results.length) * 100)

  return (
    <div className="step results-step">
      <h2>Resultados de Evaluación</h2>

      {/* Diagnóstico del Aula */}
      <section className="classroom-diagnosis">
        <h3>📊 Diagnóstico del Aula</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Promedio</p>
            <p className="stat-value">{avgScore}</p>
            <p className="stat-sub">/20</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Aprobados</p>
            <p className="stat-value">{passRate}%</p>
            <p className="stat-sub">{passCount}/{results.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total</p>
            <p className="stat-value">{results.length}</p>
            <p className="stat-sub">estudiantes</p>
          </div>
        </div>

        <div className="top-errors">
          <h4>❌ Errores Conceptuales Comunes</h4>
          <ol>
            {topErrors.map((item, idx) => (
              <li key={idx}>
                <span className="error-text">{item.error}</span>
                <span className="error-count">{item.count}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fichas Individuales */}
      <section className="individual-results">
        <h3>👤 Resultados Individuales</h3>
        <div className="results-list">
          {results.map((result, idx) => (
            <div
              key={result.studentId}
              className={`result-card ${expandedId === result.studentId ? 'expanded' : ''}`}
            >
              <div
                className="result-header"
                onClick={() => toggleExpand(result.studentId)}
              >
                <div className="result-info">
                  <span className="result-number">{idx + 1}</span>
                  <div className="result-main">
                    <p className="student-name">{result.studentName}</p>
                    <p className="score-badge" style={{ borderColor: getLevelColor(result.level) }}>
                      {result.score}/20
                    </p>
                  </div>
                </div>
                <div className="result-level" style={{ backgroundColor: getLevelColor(result.level) }}>
                  {getLevelLabel(result.level)}
                </div>
              </div>

              {expandedId === result.studentId && (
                <div className="result-details">
                  <p className="feedback-label">Retroalimentación:</p>
                  <p className="feedback-text">{result.feedback}</p>
                  <div className="feedback-actions">
                    <button className="btn btn-small">✏️ Editar</button>
                    <button className="btn btn-small">👁️ Ver respuesta</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="results-actions">
        <button className="btn btn-outline" onClick={() => alert('Exportar a CSV (próximamente)')}>
          📥 Exportar
        </button>
        <button className="btn btn-primary" onClick={onReset}>
          ➕ Procesar Más Exámenes
        </button>
      </div>
    </div>
  )
}
