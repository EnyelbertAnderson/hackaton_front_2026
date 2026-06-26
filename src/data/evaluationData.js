export const initialForm = {
  course: 'Matematica',
  grade: '5to de secundaria',
  section: 'A',
  topic: 'Resolucion de problemas',
  competency: 'Resuelve problemas de cantidad',
  bimester: 'Bimestre 2',
  evidenceType: 'Examen bimestral',
  maxScore: 20,
  rubricNotes: 'Usar la escala vigesimal y priorizar retroalimentacion formativa.',
  students: 'Ana Torres\nLuis Quispe\nMaria Huaman',
}

export const sampleResponse = {
  classroom: {
    averageScore: 14.8,
    passRate: 78,
    processedExams: 3,
    weakCompetencies: ['Argumentacion matematica', 'Comprension del enunciado'],
    commonErrors: [
      { label: 'Confunde datos relevantes con distractores', count: 2 },
      { label: 'No justifica el procedimiento', count: 2 },
      { label: 'Errores en operaciones con fracciones', count: 1 },
    ],
    recommendation:
      'Reforzar lectura del enunciado antes de operar y resolver un ejercicio guiado donde se explicite cada paso del procedimiento.',
  },
  tracking: {
    previousPeriod: 'Bimestre 1',
    currentPeriod: 'Bimestre 2',
    previousAverage: 12.9,
    currentAverage: 14.8,
    change: 1.9,
    effectiveness: 'Mejora moderada',
    intervention:
      'Aplicar lectura guiada del problema, modelado de procedimientos y una practica corta de verificacion al cierre.',
    projection:
      'Si se mantiene el refuerzo, el salon podria alcanzar un promedio de 16.1 en el siguiente bimestre.',
  },
  students: [
    {
      name: 'Ana Torres',
      score: 17,
      level: 'Logrado',
      risk: 'Bajo',
      gradingReason: 'Cumple los criterios principales de la rubrica y desarrolla correctamente el procedimiento.',
      feedback:
        'Comprende el problema y llega a una respuesta correcta. Puede mejorar explicando con mas detalle por que eligio el procedimiento.',
      evidence: 'Procedimiento correcto con justificacion parcial.',
      weaknesses: ['Justificacion del procedimiento'],
      projection: 'Puede consolidar el nivel destacado si explicita la estrategia usada.',
      trend: 'Mejora',
    },
    {
      name: 'Luis Quispe',
      score: 11,
      level: 'En proceso',
      risk: 'Medio',
      gradingReason: 'Reconoce los datos, pero el procedimiento y la justificacion estan incompletos.',
      feedback:
        'Reconoce algunos datos, pero el procedimiento queda incompleto. Conviene revisar como traducir el enunciado a una operacion.',
      evidence: 'Identifica datos, pero omite la verificacion final.',
      weaknesses: ['Comprension del enunciado', 'Eleccion de la operacion', 'Verificacion'],
      projection: 'Requiere acompanamiento focalizado para alcanzar el nivel esperado.',
      trend: 'En observacion',
    },
    {
      name: 'Maria Huaman',
      score: 16,
      level: 'Logrado',
      risk: 'Bajo',
      gradingReason: 'La respuesta es coherente y cumple la rubrica, con un error menor de calculo.',
      feedback:
        'Presenta una solucion clara y ordenada. Debe cuidar pequenos errores de calculo para sostener el resultado.',
      evidence: 'Respuesta coherente con error menor de calculo.',
      weaknesses: ['Precision en el calculo'],
      projection: 'Tiene alta probabilidad de mejorar si incorpora una revision final.',
      trend: 'Mejora',
    },
  ],
}

export const bimesterOptions = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4']
export const evidenceTypeOptions = ['Examen bimestral', 'Practica', 'Tarea', 'Proyecto']
