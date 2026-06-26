import { normalizeResults } from '../utils/evaluation'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function createEvaluationPayload({ files, rubricFile, form, studentNames }) {
  const payload = new FormData()

  files.forEach((file) => payload.append('files', file))
  payload.append('metadata', JSON.stringify({
    course: form.course,
    grade: form.grade,
    section: form.section,
    topic: form.topic,
    competency: form.competency,
    bimester: form.bimester,
    evidenceType: form.evidenceType,
    maxScore: Number(form.maxScore),
    students: studentNames,
  }))
  payload.append('rubricFile', rubricFile)
  payload.append('rubricNotes', form.rubricNotes)

  return payload
}

export async function submitEvaluation(payload) {
  const response = await fetch(`${API_BASE_URL}/api/evaluations/process`, {
    method: 'POST',
    body: payload,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Error ${response.status}`)
  }

  return normalizeResults(await response.json())
}
