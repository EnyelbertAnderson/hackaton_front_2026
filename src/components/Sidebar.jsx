export default function Sidebar({ apiBaseUrl }) {
  return (
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
        <strong>{apiBaseUrl}</strong>
        <small>Configura VITE_API_URL para apuntar a tu API.</small>
      </div>
    </aside>
  )
}
