const RUBRIC_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const RUBRIC_EXTENSIONS = ['.pdf', '.doc', '.docx']

export function isAllowedRubric(file) {
  return RUBRIC_MIME_TYPES.includes(file.type) ||
    RUBRIC_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension))
}

export function normalizeResults(data) {
  return {
    classroom: data.classroom || data.diagnosis || data.summary || {},
    students: data.students || data.results || data.evaluations || [],
    tracking: data.tracking || data.progress || data.bimesterComparison || null,
  }
}

export function getStudentScore(student) {
  return student?.score ?? student?.aiScore ?? student?.grade ?? student?.earnedPoints ?? '-'
}

export function calculatePercentage(score, maxScore) {
  const numericScore = Number(score)
  const numericMaxScore = Number(maxScore)

  if (Number.isNaN(numericScore) || !numericMaxScore) {
    return 0
  }

  return Math.round((numericScore / numericMaxScore) * 100)
}

export function getWeaknesses(student) {
  const weaknesses = student?.weaknesses ?? student?.difficulties ?? student?.errors ?? []

  if (Array.isArray(weaknesses)) {
    return weaknesses.map((item) => typeof item === 'string' ? item : item.label).filter(Boolean)
  }

  return weaknesses ? [String(weaknesses)] : []
}

export function getStatusClass(student) {
  const level = String(student?.level || '').toLowerCase()

  if (level.includes('inicio') || level.includes('riesgo')) return 'needs-support'
  if (level.includes('proceso')) return 'in-progress'
  return 'achieved'
}

export function formatChange(change) {
  const numericChange = Number(change)
  if (Number.isNaN(numericChange)) return '-'
  return `${numericChange > 0 ? '+' : ''}${numericChange}`
}

export function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
