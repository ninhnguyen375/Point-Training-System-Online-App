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

export const getEvaluationPrivateService = (params) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/Private`,
    method: 'get',
    params,
  })

export const getPointOnlineService = (code) =>
  fetchAxios({
    url: `${configs.CrawlerAPI}/crawler/get-point`,
    method: 'get',
    params: { code },
  })

export const uploadFileService = (evaluationId, file) => {
  const form = new FormData()

  form.append('evaluationId', evaluationId)
  form.append('imageFile', file, file.name)

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

export const lecturerApproveService = (evaluationId) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/EvaluatedByLecturer/${evaluationId}`,
    method: 'put',
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

export const getEvaluationListService = (params) =>
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

export const getDeadline = (evaluationData, viewRole) => {
  if (!evaluationData) {
    return ''
  }

  // monitor first
  if (viewRole === ROLE.monitor) {
    return `${moment(evaluationData.deadlineDateForStudent).format(
      'DD/MM/yyyy',
    )} - ${moment(evaluationData.deadlineDateForMonitor).format('DD/MM/yyyy')}`
  }

  if (viewRole === ROLE.student) {
    return moment(evaluationData.deadlineDateForStudent).format('DD/MM/yyyy')
  }

  if (viewRole === ROLE.lecturer) {
    return `${moment(evaluationData.deadlineDateForMonitor).format(
      'DD/MM/yyyy',
    )} - ${moment(evaluationData.deadlineDateForLecturer).format('DD/MM/yyyy')}`
  }

  return ''
}
