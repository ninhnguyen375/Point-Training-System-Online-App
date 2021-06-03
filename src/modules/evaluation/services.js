import moment from 'moment'
import { fetchAxios, fetchAuthLoading, fetchAuth } from '../../common/fetch'
import { configs } from '../../configs'
import { ROLE } from '../user/model'

export const getPointTrainingGroupsService = (token) =>
  fetchAuth({
    url: `${configs.API}/PointTrainingGroups`,
    method: 'get',
    pageLoading: true,
    token,
  })

export const startEvaluationService = (data) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/Create`,
    method: 'post',
    data,
  })

export const getEvaluationPrivateService = (
  params = { studentId: null, semesterId: null, yearId: null },
) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/Private`,
    method: 'get',
    params,
  })

export const getPointOnlineService = (code) =>
  fetchAxios({
    url: `${configs.ServiceAPI}/crawler/get-point`,
    method: 'get',
    params: { code },
  })

export const uploadFileService = (evaluationId, file, fileName) => {
  const form = new FormData()

  form.append('evaluationId', evaluationId)
  form.append('imageFile', file, fileName)

  return fetchAuthLoading({
    url: `${configs.API}/files/add`,
    method: 'post',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const removeFileService = (evaluationId, fileName) =>
  fetchAuthLoading({
    url: `${configs.API}/files/remove`,
    method: 'delete',
    data: {
      evaluationId,
      fileName,
    },
  })

export const studentMakeDraftEvaluationService = (
  evaluationId,
  evaluation,
  previousResult,
  currentResult,
) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/EvaluatedByStudent`,
    method: 'post',
    data: {
      id: evaluationId,
      studentEvaluation: evaluation,
      previousResult,
      currentResult,
    },
  })

export const studentMakeEvaluationService = (evaluationId) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/SubmitEvaluationByStudent/${evaluationId}`,
    method: 'put',
  })

export const deputydeanConfirmService = (evaluationId, deputydeanId) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/CompletedByDeputyDean/${evaluationId},${deputydeanId}`,
    method: 'put',
  })

export const lecturerConfirmService = (
  evaluationId,
  evaluation,
  previousResult,
  currentResult,
  conclusionPoint,
  classification,
  note,
) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/EvaluatedByLecturer`,
    method: 'post',
    data: {
      id: evaluationId,
      lecturerEvaluation: evaluation,
      previousResult,
      currentResult,
      conclusionPoint,
      classification,
      note,
    },
  })

export const employeeConfirmService = (
  evaluationId,
  evaluation,
  previousResult,
  currentResult,
  conclusionPoint,
  classification,
  note,
  employeeId,
) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/EvaluatedByEmployee`,
    method: 'post',
    data: {
      id: evaluationId,
      employeeEvaluation: evaluation,
      previousResult,
      currentResult,
      conclusionPoint,
      classification,
      note,
      employeeId,
    },
  })

export const complainService = (evaluationId, note) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/ComplainedByStudent`,
    method: 'post',
    data: {
      evaluationId,
      note,
    },
  })

export const monitorMakeEvaluationService = (
  evaluationId,
  evaluation,
  previousResult,
  currentResult,
  conclusionPoint,
  classification,
  note,
) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/EvaluatedByMonitor`,
    method: 'post',
    data: {
      id: evaluationId,
      monitorEvaluation: evaluation,
      previousResult,
      currentResult,
      conclusionPoint,
      classification,
      note,
    },
  })

export const getEvaluationBatchListService = () =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/GetAllEvaluationsCreated`,
    method: 'get',
  })

export const updateEvaluationBatchService = (semesterId, yearId, data) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/UpdateEvaluationPeriod/${semesterId},${yearId}`,
    method: 'put',
    data,
  })

export const getEvaluationsService = (params) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations`,
    method: 'get',
    params,
  })

export const getClassesOfLecturerService = (id) =>
  fetchAuthLoading({
    url: `${configs.API}/StudentClasses/GetStudentClassesByLecturer/${id}`,
    method: 'get',
  })

export const activeEvaluationBatchService = (yearId, semesterId) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/ActivateEvaluationPeriod/${semesterId},${yearId},true`,
    method: 'put',
  })

export const cancelEvaluationService = (
  evaluationId,
  reasonForCancellation,
  userId,
  roleName,
) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/CanceledByMonitor`,
    method: 'post',
    data: {
      id: evaluationId,
      reasonForCancellation,
      userId,
      roleName,
    },
  })

export const validateDeadline = (deadline) => {
  if (!deadline) {
    return false
  }

  const currentDate = moment().format('DD-MM-YYYY')
  const isValidDate = moment(currentDate, 'DD-MM-YYYY').isSameOrBefore(
    moment(deadline, 'DD-MM-YYYY'),
  )

  if (isValidDate) {
    return true
  }

  return false
}

export const getNote = (note) => {
  try {
    return JSON.parse(note) || {}
  } catch (err) {
    return {}
  }
}

export const getDeadline = (evaluationData, viewRole) => {
  if (!evaluationData) {
    return ''
  }

  // monitor first
  if (viewRole === ROLE.monitor) {
    return `${moment(
      evaluationData.deadlineDateForStudent,
      'DD/MM/yyyy',
    ).format('DD/MM/yyyy')} - ${moment(
      evaluationData.deadlineDateForMonitor,
      'DD/MM/yyyy',
    ).format('DD/MM/yyyy')}`
  }

  // deadline for student
  if (viewRole === ROLE.student) {
    return moment(evaluationData.deadlineDateForStudent, 'DD/MM/yyyy').format(
      'DD/MM/yyyy',
    )
  }

  // deadline for lecturer
  if (viewRole === ROLE.lecturer) {
    return `${moment(
      evaluationData.deadlineDateForMonitor,
      'DD/MM/yyyy',
    ).format('DD/MM/yyyy')} - ${moment(
      evaluationData.deadlineDateForLecturer,
      'DD/MM/yyyy',
    ).format('DD/MM/yyyy')}`
  }

  // deadline for employee
  if (viewRole === ROLE.employee) {
    return `${moment(
      evaluationData.deadlineDateForStudent,
      'DD/MM/yyyy',
    ).format('DD/MM/yyyy')} - ${moment(
      evaluationData.deadlineDateForLecturer,
      'DD/MM/yyyy',
    ).format('DD/MM/yyyy')}`
  }

  return ''
}

export const signPDFAsync = (data) =>
  fetchAuthLoading({
    url: `${configs.API}/PDFSignatures`,
    method: 'post',
    data,
  })

export const sendMailService = (email, content) =>
  fetchAxios({
    url: `${configs.ServiceAPI}/mailer/send`,
    method: 'post',
    data: {
      email,
      content,
    },
  })

export const deleteEvaluationBatchService = (semesterId, yearId) =>
  fetchAxios({
    url: `${configs.API}/Evaluations/DeleteEvaluationPeriod/${semesterId},${yearId}`,
    method: 'delete',
  })

export const restoreEvaluationService = (evaluationId, employeeId) =>
  fetchAxios({
    url: `${configs.API}/Evaluations/RestoreEvaluation/${evaluationId},${employeeId}`,
    method: 'put',
  })

export const getTimelineEditingService = (evaluationId) =>
  fetchAxios({
    url: `${configs.API}/Evaluations/GetTimelineEditing/${evaluationId}`,
    method: 'get',
  })
