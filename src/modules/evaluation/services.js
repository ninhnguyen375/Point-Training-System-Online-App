import {fetchAxios, fetchAuthLoading} from '../../common/fetch'
import {configs} from '../../configs'

export const getPointTrainingGroupsService = () =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingGroups`,
    method: 'get',
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

export const getYearsService = () =>
  fetchAuthLoading({
    url: `${configs.API}/Years`,
    method: 'get',
  })

export const getPointOnlineService = (code) =>
  fetchAxios({
    url: `${configs.CrawlerAPI}/crawler/get-point`,
    method: 'get',
    params: {code},
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
