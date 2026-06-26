import { formatChange } from '../utils/evaluation'

export default function BimesterTracking({ tracking, classroom, bimester }) {
  return (
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
          <span>{tracking?.currentPeriod || bimester}</span>
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
  )
}
