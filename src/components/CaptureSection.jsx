export default function CaptureSection({ previews, onFilesChange }) {
  return (
    <section id="captura" className="panel capture-panel">
      <div className="section-title">
        <span>1</span>
        <div>
          <h3>Captura de examenes</h3>
          <p>Sube una foto por estudiante. El backend recibira las imagenes como FormData.</p>
        </div>
      </div>

      <label className="dropzone" htmlFor="exam-files">
        <input id="exam-files" type="file" accept="image/*" multiple onChange={onFilesChange} />
        <strong>Seleccionar fotografias</strong>
        <span>JPG, PNG o HEIC desde camara o galeria</span>
      </label>

      {previews.length > 0 && (
        <div className="preview-grid">
          {previews.map((preview, index) => (
            <figure key={`${preview.file.name}-${index}`}>
              <img src={preview.url} alt={`Examen ${index + 1}`} />
              <figcaption>Examen {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
