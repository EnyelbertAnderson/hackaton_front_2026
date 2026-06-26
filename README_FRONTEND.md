# Ñawi - Frontend Hackathon NEXIA 2026

## 🎯 Descripción

Prototipo funcional del frontend para **Ñawi**, plataforma de IA multimodal que convierte exámenes en papel en evaluación formativa asistida.

## 📱 Características Implementadas

### Flujo Principal
1. **Carga de Fotos** - Upload múltiple (hasta 30 fotos)
2. **Previsualización** - Thumbnails numerados con opción de eliminar
3. **Asignación de Alumnos** - Ingreso de nombres (uno por línea)
4. **Procesamiento** - Barra de progreso con estados
5. **Resultados** - Dashboard con diagnóstico del aula y fichas individuales

### Diseño Responsive
- Mobile-first
- Optimizado para celular (docentes en campo)
- Funciona sin instalación (web app)

### Componentes Modulares
```
/src/components/
├── ExamUploader.jsx          (contenedor principal)
├── ExamPreview.jsx           (previsualizaciones)
├── StudentAssign.jsx         (asignación de alumnos)
├── ProgressBar.jsx           (barra de progreso)
├── ResultsDashboard.jsx      (resultados)
└── ExamUploader.css          (estilos)
```

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18+ 
- npm o pnpm

### Setup
```bash
# Ir al proyecto
cd c:\Hackaton_unsa_2026\Front\hackaton_2026

# Instalar dependencias (ya están en package.json)
npm install

# Ejecutar en desarrollo
npm run dev

# Acceder en navegador
# http://localhost:5173
```

### Build para producción
```bash
npm run build

# Preview del build
npm run preview
```

## 📐 Flujo de Datos (Simulado)

```
Upload Fotos
    ↓
Preview + Validar
    ↓
Asignar Alumnos
    ↓
Procesar (simula llamada al backend)
    ↓
Dashboard con Resultados
    ↓
Opción: Procesar más exámenes
```

## 🎨 Paleta de Colores

- **Primario**: #667eea (morado claro)
- **Primario Oscuro**: #764ba2 (morado oscuro)
- **Éxito**: #4ade80 (verde)
- **Advertencia**: #fbbf24 (amarillo)
- **Peligro**: #f87171 (rojo)

## ⚙️ Estado Actual (MVP)

✅ **Completado**
- Interfaz completa responsive
- Flujo end-to-end funcional
- Componentes reutilizables
- Animaciones suaves
- Procesamiento simulado para demo

⏳ **Próximas Fases**
- Conectar con backend FastAPI
- Implementar compresión real de imágenes
- Integración con modelos de IA (Haiku 4.5, Gemini, etc.)
- Persistencia de datos (opcional para MVP)
- Autenticación docente

## 📦 Dependencias

```json
{
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "vite": "^8.1.0",
    "@vitejs/plugin-react": "^6.0.2"
  }
}
```

## 🔗 Conexión Backend

Cuando el backend (FastAPI) esté listo, actualizar:
- `ExamUploader.jsx` → función `processExams()` llamará a `/api/process` del backend
- Reemplazar simulación por llamadas reales a la API

**Endpoint esperado**:
```
POST /api/process
Body: {
  photos: File[],
  rubrica: string,
  students: string[]
}
Response: {
  results: [{studentName, score, feedback, level}],
  diagnosis: {topErrors, avgScore, passRate}
}
```

## 🎯 Uso en Hackathon

1. **Para demostración**: Ejecutar `npm run dev` y abrir en celular/navegador
2. **Para presentación**: Usar `npm run build` y desplegar en Railway/Render
3. **QR de acceso**: Generar con herramienta QR a partir de URL pública

## 📝 Notas de Desarrollo

- Sin overengineering - pragmático para hackathon
- CSS vanilla (sin TailwindCSS) para máxima compatibilidad
- React hooks básicos (useState)
- Animaciones con CSS puro
- Mobile-first siempre

## 📞 Contacto & Créditos

**Hackathon NEXIA 2026** - Arequipa, Perú  
Track 2: Evaluación Inteligente y Feedback en Tiempo Real

---

¿Preguntas? Ver el documento HANDOFF para contexto completo del proyecto.
