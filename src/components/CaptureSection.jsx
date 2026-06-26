export default function CaptureSection({ previews, onFilesChange }) {
  return (
    <section id="captura" className="panel capture-panel">
      <div className="section-title">
        <span>1</span>
        <div>
          <h3>Captura de examenes</h3>
          <p>Sube una foto o PDF por estudiante. El backend recibira los archivos como FormData.</p>
        </div>
      </div>

      <label className="dropzone" htmlFor="exam-files">
        <input
          id="exam-files"
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={onFilesChange}
        />
        <strong>Seleccionar fotografias o PDF</strong>
        <span>JPG, PNG, HEIC o PDF — uno por estudiante</span>
      </label>

      {previews.length > 0 && (
        <div className="preview-grid">
          {previews.map((preview, index) => (
            <figure key={`${preview.file.name}-${index}`}>
              {preview.isPdf ? (
                <div className="pdf-preview">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="8" y="4" width="28" height="36" rx="3" fill="#e8f4f0" stroke="#8ab8a8" strokeWidth="1.5"/>
                    <path d="M28 4v10h10" stroke="#8ab8a8" strokeWidth="1.5" fill="none"/>
                    <rect x="12" y="28" width="20" height="7" rx="2" fill="#8ab8a8"/>
                    <text x="22" y="34" textAnchor="middle" fontSize="5" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">PDF</text>
                    <line x1="14" y1="20" x2="30" y2="20" stroke="#8ab8a8" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="14" y1="24" x2="26" y2="24" stroke="#8ab8a8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="pdf-name">{preview.file.name}</span>
                </div>
              ) : (
                <img src={preview.url} alt={`Examen ${index + 1}`} />
              )}
              <figcaption>Examen {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
