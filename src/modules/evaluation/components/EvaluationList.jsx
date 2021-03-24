import {
  Button,
  Card,
  Divider,
  notification,
  Radio,
  Select,
  Table,
  Tag,
} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {evaluationStatus, evaluationStatusColor, semesters} from '../model'
import {
  getClassesOfLecturerService,
  getEvaluationBatchListService,
  getEvaluationListService,
  getYearsService,
} from '../services'
import {MODULE_NAME as MODULE_USER, ROLE} from '../../user/model'

const EvaluationList = () => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [years, setYears] = useState([])
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [classId, setClassId] = useState(null)
  const [evaluationList, setEvaluationList] = useState([])
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const [classesOfLecturer, setClassesOfLecturer] = useState([])

  const history = useHistory()

  const getEvaluationBatch = useCallback(async () => {
    try {
      let {data} = await getEvaluationBatchListService()
      data = data.data
      data = data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1))
      setEvaluationBatches(data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  const getClassesOfLecturer = useCallback(async (id) => {
    try {
      const {data} = await getClassesOfLecturerService(id)
      setClassesOfLecturer(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    if (profile.roleName === ROLE.lecturer) {
      getClassesOfLecturer(profile.id)
    }
  }, [getClassesOfLecturer, profile.roleName])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const getYears = useCallback(async () => {
    try {
      const {data} = await getYearsService()
      setYears(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getYears()
  }, [getYears])

  const getEvaluationList = useCallback(async (yId, sId, params) => {
    try {
      const {data} = await getEvaluationListService({
        yearId: yId,
        semesterId: sId,
        ...params,
      })
      setEvaluationList(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    if (yearId && semesterId) {
      if (profile.roleName === ROLE.lecturer) {
        if (classId) {
          getEvaluationList(yearId, semesterId, {
            lecturerId: profile.id,
            studentClassId: classId,
          })
        }
      } else {
        getEvaluationList(yearId, semesterId, {monitorId: profile.id})
      }
    }
  }, [getEvaluationList, yearId, semesterId, classId, profile])

  const columns = [
    {
      title: <b>Sinh Viên</b>,
      render: (r) => <b>{r.student.fullName}</b>,
    },
    {
      title: <b>MSSV</b>,
      render: (r) => r.student.code,
    },
    {
      title: <b>Trạng Thái</b>,
      align: 'center',
      render: (r) => (
        <Tag color={evaluationStatusColor[r.status]}>{r.status}</Tag>
      ),
    },
    {
      title: <b>Tổng Điểm</b>,
      align: 'center',
      render: (r) => r.conclusionPoint || '--',
    },
    {
      title: <b>Xếp Loại</b>,
      align: 'center',
      render: (r) => r.classification || '--',
    },
    {
      title: <b>Hành Động</b>,
      align: 'right',
      render: (r) => {
        if (
          profile.isMonitor &&
          r.status === evaluationStatus.SubmitEvaluationStatus
        ) {
          return (
            <Button
              onClick={() => history.push('/evaluation/confirm', r)}
              type="primary"
            >
              ĐÁNH GIÁ
            </Button>
          )
        }

        if (
          profile.isMonitor &&
          r.status === evaluationStatus.ConfirmEvaluationStatus
        ) {
          return (
            <Button
              onClick={() => history.push('/evaluation/confirm', r)}
              type="default"
            >
              CHỈNH SỬA
            </Button>
          )
        }

        if (
          profile.roleName === ROLE.lecturer &&
          r.status === evaluationStatus.ConfirmEvaluationStatus
        ) {
          return (
            <Button
              onClick={() => history.push('/evaluation/confirm', r)}
              type="default"
            >
              XÉT DUYỆT
            </Button>
          )
        }

        return '--'
      },
    },
  ]

  return (
    <Card
      size="small"
      title={
        <span>
          <b>DANH SÁCH PHIẾU ĐIỂM RÈN LUYỆN CỦA LỚP</b>
        </span>
      }
    >
      <div>
        <div>Chọn học kỳ:</div>
        {evaluationBatches[0] && (
          <Select
            onChange={(v) => {
              setYearId(v.split('-')[0])
              setSemesterId(v.split('-')[1])
            }}
            style={{width: 300}}
            placeholder="Chọn học kỳ"
          >
            {evaluationBatches.map((evaluationBatch) => (
              <Select.Option
                key={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
                value={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
              >
                Năm học
                {' '}
                {evaluationBatch.year.title}
                {' '}
                -
                {' '}
                {evaluationBatch.semester.title}
              </Select.Option>
            ))}
          </Select>
        )}
        {profile.roleName === ROLE.lecturer && classesOfLecturer[0] && (
          <div className="mt-3">
            <div>Chọn lớp:</div>
            <Select
              onChange={(v) => setClassId(v)}
              placeholder="Chọn lớp"
              style={{width: 300}}
            >
              {classesOfLecturer.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.title}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="col-lg-6">
        <Divider />
      </div>

      {evaluationList[0] && (
        <Table
          size="small"
          rowKey={(r) => r.id}
          dataSource={evaluationList}
          columns={columns}
        />
      )}
    </Card>
  )
}

export default EvaluationList
