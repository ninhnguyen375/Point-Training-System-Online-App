import {
  Alert,
  Button,
  Card,
  Divider,
  Input,
  notification,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import qs from 'query-string'
import React, {useCallback, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import moment from 'moment'
import handleError from '../../../common/utils/handleError'
import {
  classification,
  evaluationStatus,
  evaluationStatusColor,
} from '../model'
import {
  getClassesOfLecturerService,
  getDeadline,
  getEvaluationBatchListService,
  getEvaluationListService,
  lecturerApproveService,
  validateDeadline,
} from '../services'
import {MODULE_NAME as MODULE_USER, ROLE} from '../../user/model'

const EvaluationList = () => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [classId, setClassId] = useState(null)
  const [evaluationList, setEvaluationList] = useState(null)
  const [filteredEvaluationList, setFilteredEvaluationList] = useState(null)
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const [classesOfLecturer, setClassesOfLecturer] = useState([])
  const [search, setSearch] = useState({})

  const getEvaluationBatch = useCallback(async () => {
    try {
      let {data} = await getEvaluationBatchListService()
      data = data.data
      data = data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1))
      setEvaluationBatches(data)
      setYearId(data[0].year.id)
      setSemesterId(data[0].semester.id)
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

  const getEvaluationList = useCallback(async () => {
    if (!yearId || !semesterId) {
      return
    }
    if (profile.roleName === ROLE.lecturer && !classId) {
      return
    }

    let params
    if (profile.roleName === ROLE.lecturer) {
      params = {
        lecturerId: profile.id,
        studentClassId: classId,
      }
    } else {
      params = {monitorId: profile.id}
    }

    try {
      const {data} = await getEvaluationListService({
        yearId,
        semesterId,
        ...params,
      })
      setEvaluationList(data.data)
      setFilteredEvaluationList(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [yearId, semesterId, classId])

  useEffect(() => {
    getEvaluationList()
  }, [getEvaluationList])

  const gotoConfirmPage = (r) => {
    const tab = window.open(
      `/evaluation/confirm?${qs.stringify({
        studentId: r.studentId,
        yearId: r.yearId,
        semesterId: r.semesterId,
      })}`,
      '_blank',
    )
    tab.focus()
  }

  const handleLecturerApprove = async (evaluationId) => {
    try {
      await lecturerApproveService(evaluationId)
      await getEvaluationList()
      notification.success({
        message: 'Cố vấn học tập xét duyệt',
        description: 'Thành công',
      })
    } catch (err) {
      handleError(err, null, notification)
    }
  }

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
      render: (r) => r.conclusionPoint,
    },
    {
      title: <b>Xếp Loại</b>,
      align: 'center',
      render: (r) => r.classification,
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
            <Button onClick={() => gotoConfirmPage(r)} type="primary">
              <i className="fas fa-pen-alt me-2" />
              ĐÁNH GIÁ
            </Button>
          )
        }

        if (
          (profile.isMonitor &&
            r.status === evaluationStatus.ConfirmEvaluationStatus) ||
          r.status === evaluationStatus.ComplainEvaluationStatus
        ) {
          return (
            <Button onClick={() => gotoConfirmPage(r)} type="default">
              <i className="fas fa-edit me-2" />
              CHỈNH SỬA
            </Button>
          )
        }

        if (
          profile.roleName === ROLE.lecturer &&
          r.status === evaluationStatus.ConfirmEvaluationStatus
        ) {
          const isValidDeadline = validateDeadline(
            getDeadline(r, ROLE.lecturer).split(' - ').pop(),
          )
          return (
            <Tooltip
              title={
                isValidDeadline
                  ? ''
                  : `Quá hạn chót ${moment(r.deadlineDateForLecturer).format(
                    'DD-MM-YYYY',
                  )}`
              }
            >
              <Popconfirm
                title="Xác nhận"
                onConfirm={() => handleLecturerApprove(r.studentId)}
                disabled={!isValidDeadline}
              >
                <Button
                  disabled={!isValidDeadline}
                  className="success me-2"
                  type="primary"
                >
                  <i className="fas fa-check me-2" />
                  DUYỆT NGAY
                </Button>
              </Popconfirm>
              <Button
                onClick={() => gotoConfirmPage(r)}
              >
                <i className="fas fa-info me-2" />
                XEM
              </Button>
            </Tooltip>
          )
        }

        return (
          <Button
            onClick={() => gotoConfirmPage(r)}
          >
            <i className="fas fa-info me-2" />
            XEM
          </Button>
        )
      },
    },
  ]

  const renderSelectBatch = (batches = []) => {
    if (batches.length === 0) {
      return ''
    }

    return (
      <div className="col-lg-4">
        <div>Chọn Năm học và Học kỳ:</div>
        <Select
          onChange={(v) => {
            setYearId(v.split('-')[0])
            setSemesterId(v.split('-')[1])
          }}
          placeholder="Chọn Năm học và Học kỳ"
          style={{width: '100%'}}
          value={yearId && semesterId ? `${yearId}-${semesterId}` : null}
        >
          {evaluationBatches.map((evaluationBatch) => (
            <Select.Option
              key={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
              value={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
            >
              {`Năm học ${evaluationBatch.year.title} - ${evaluationBatch.semester.title}`}
            </Select.Option>
          ))}
        </Select>
        <Alert
          className="mt-2"
          message="Chọn lại Năm học và Học kỳ nếu chưa chính xác"
          type="error"
        />
      </div>
    )
  }

  const applySearch = useCallback(() => {
    if (!evaluationList) {
      return
    }

    let newEvaluationList = [...evaluationList]

    if (search.fullName) {
      newEvaluationList = newEvaluationList.filter(
        (e) =>
          e.student.fullName
            .toLowerCase()
            .indexOf(search.fullName.toLowerCase()) > -1,
      )
    }
    if (search.code) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.student.code.indexOf(search.code) > -1,
      )
    }
    if (search.status) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.status === search.status,
      )
    }
    if (search.classification) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.classification === search.classification,
      )
    }

    setFilteredEvaluationList(newEvaluationList)
  }, [search, evaluationList])

  useEffect(() => {
    applySearch()
  }, [applySearch])

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
        {renderSelectBatch(evaluationBatches)}

        {profile.roleName === ROLE.lecturer && classesOfLecturer[0] && (
          <div className="mt-3 col-lg-4">
            <div>Chọn lớp:</div>
            <Select
              onChange={(v) => setClassId(v)}
              placeholder="Chọn lớp"
              style={{width: '100%'}}
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

      <Divider />

      {filteredEvaluationList && (
        <div>
          <div className="d-flex justify-content-between flex-wrap">
            <div className="d-flex flex-wrap">
              <Input
                onChange={(e) =>
                  setSearch({...search, fullName: e.target.value})}
                allowClear
                className="me-2 mb-2"
                style={{width: 200}}
                placeholder="Tên SV"
              />
              <Input
                onChange={(e) => setSearch({...search, code: e.target.value})}
                allowClear
                className="me-2 mb-2"
                style={{width: 200}}
                placeholder="MSSV"
              />
              <Select
                onChange={(v) => setSearch({...search, status: v})}
                placeholder="Trạng thái"
                className="me-2 mb-2"
                style={{width: 200}}
                allowClear
              >
                {Object.keys(evaluationStatus).map((k) => (
                  <Select.Option key={k} value={evaluationStatus[k]}>
                    {evaluationStatus[k]}
                  </Select.Option>
                ))}
              </Select>
              <Select
                onChange={(v) => setSearch({...search, classification: v})}
                placeholder="Xếp loại"
                className="me-2 mb-2"
                style={{width: 120}}
                allowClear
              >
                {classification.map((c) => (
                  <Select.Option key={c} value={c}>
                    {c}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Button onClick={() => getEvaluationList()} type="primary">
              <i className="fas fa-sync me-2" />
              LÀM MỚI
            </Button>
          </div>
          <Table
            size="small"
            rowKey={(r) => r.id}
            dataSource={filteredEvaluationList}
            columns={columns}
            scroll={{x: '600px'}}
          />
        </div>
      )}
    </Card>
  )
}

export default EvaluationList
