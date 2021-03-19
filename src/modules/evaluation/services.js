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
