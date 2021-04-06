import {
  Button,
  Card,
  Divider,
  Input,
  message,
  notification,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import qs from 'query-string'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {
  classification,
  evaluationStatus,
  evaluationStatusColor,
  reasonForCancellation,
} from '../model'
import {
  cancelEvaluationService,
  getDeadline,
  getEvaluationBatchListService,
  getEvaluationListService,
  lecturerApproveService,
  validateDeadline,
} from '../services'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../user/model'
import { getString } from '../../../common/utils/object'
import SelectReasonCancellationForm from './SelectReasonCancellationForm'

const EvaluationList = () => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [evaluationList, setEvaluationList] = useState(null)
  const [filteredEvaluationList, setFilteredEvaluationList] = useState(null)
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const [studentClasses, setStudentClasses] = useState([])
  const [search, setSearch] = useState({})

  const history = useHistory()

  const getCurrentActive = (batches = []) => batches.find((b) => b.isInDeadline)
  const checkIsCurrentActive = (yId, sId) => {
    const found = evaluationBatches.find(
      (b) =>
        parseInt(b.year.id, 10) === parseInt(yId, 10) &&
        parseInt(b.semester.id, 10) === parseInt(sId, 10),
    )

    if (found) {
      return found.isInDeadline
    }

    return false
  }

  const groupStudentClasses = (src = []) => {
    try {
      return src.reduce(
        (prev, curr) =>
          prev.includes(curr.student.studentClass.title)
            ? prev
            : [...prev, curr.student.studentClass.title],
        [],
      )
    } catch (err) {
      return []
    }
  }

  const getEvaluationBatch = useCallback(async () => {
    try {
      let { data } = await getEvaluationBatchListService()
      data = data.data
      data = data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1))
      setEvaluationBatches(data)

      // default active select batch
      const currentActive = getCurrentActive(data)
      if (currentActive) {
        setYearId(currentActive.year.id)
        setSemesterId(currentActive.semester.id)
      }
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const getEvaluationList = useCallback(async () => {
    if (!yearId || !semesterId) {
      return
    }

    const params = {}

    if (profile.roleName === ROLE.lecturer) {
      params.lecturerId = profile.id
    } else {
      params.monitorId = profile.id
    }

    try {
      const { data } = await getEvaluationListService({
        yearId,
        semesterId,
        ...params,
      })

      setStudentClasses(groupStudentClasses(data.data))
      setEvaluationList(data.data)
      setFilteredEvaluationList(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [yearId, semesterId])

  useEffect(() => {
    getEvaluationList()
  }, [getEvaluationList])

  const gotoConfirmPage = (r) => {
    history.push(
      `/evaluation/confirm?${qs.stringify({
        studentId: r.studentId,
        yearId: r.yearId,
        semesterId: r.semesterId,
      })}`,
    )
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

  const cancelEvaluation = (evaluationId) => async (
    reasonForCancellationInput,
  ) => {
    if (!reasonForCancellationInput) {
      message.error('Chọn lý do hủy')
      return
    }

    try {
      await cancelEvaluationService(evaluationId, reasonForCancellationInput)

      notification.success({ message: 'Hủy phiếu thành công' })
      await getEvaluationList()
      window.Modal.clear()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleCancelEvaluation = (evaluationId) => {
    window.Modal.show(
      <SelectReasonCancellationForm
        onSubmit={cancelEvaluation(evaluationId)}
      />,
      {
        title: <b>Chọn lý do hủy</b>,
      },
    )
  }

  let columns = [
    {
      key: 'studentClass',
      title: <b>Lớp</b>,
      render: (r) => <b>{getString(r, 'student.studentClass.title')}</b>,
    },
    {
      key: 'fullName',
      title: <b>Sinh Viên</b>,
      render: (r) => <b>{r.student.fullName}</b>,
    },
    {
      key: 'code',
      title: <b>MSSV</b>,
      render: (r) => r.student.code,
    },
    {
      key: 'status',
      title: <b>Trạng Thái</b>,
      align: 'center',
      render: (r) => (
        <Tag color={evaluationStatusColor[r.status]}>{r.status}</Tag>
      ),
    },
    {
      key: 'reasonForCancellation',
      title: <b>Phiếu Hủy</b>,
      align: 'center',
      render: (r) =>
        r.reasonForCancellation ? (
          <Tag color="red">{r.reasonForCancellation}</Tag>
        ) : (
          ''
        ),
    },
    {
      key: 'conclustionPoint',
      title: <b>Tổng Điểm</b>,
      align: 'center',
      render: (r) =>
        r.conclusionPoint === null ? (
          <i className="text-secondary">chưa có</i>
        ) : (
          r.conclusionPoint
        ),
    },
    {
      key: 'classification',
      title: <b>Xếp Loại</b>,
      align: 'center',
      render: (r) =>
        r.classification || <i className="text-secondary">chưa có</i>,
    },
    {
      key: 'action',
      title: <b>Hành Động</b>,
      align: 'right',
      render: (r) => {
        const actions = []

        // monitor confirm
        if (
          profile.isMonitor &&
          r.status === evaluationStatus.SubmitEvaluationStatus
        ) {
          actions.push(
            <Button
              key="monitor-confirm"
              onClick={() => gotoConfirmPage(r)}
              type="primary"
            >
              <i className="fas fa-pen-alt me-2" />
              ĐÁNH GIÁ
            </Button>,
          )
        }

        // monitor cancel
        if (
          profile.isMonitor &&
          r.status === evaluationStatus.NewEvaluationStatus
        ) {
          actions.push(
            <Button
              key="monitor-cancel"
              onClick={() => handleCancelEvaluation(r.id)}
              danger
              type="primary"
              className="ms-2"
            >
              <i className="fas fa-ban me-2" />
              HỦY PHIẾU
            </Button>,
          )
        }

        // monitor update
        if (
          (profile.isMonitor &&
            r.status === evaluationStatus.ConfirmEvaluationStatus) ||
          r.status === evaluationStatus.ComplainWithMonitorAboutEvaluationStatus
        ) {
          actions.push(
            <Button
              key="monitor-update"
              onClick={() => gotoConfirmPage(r)}
              type="default"
              className="ms-2"
            >
              <i className="fas fa-edit me-2" />
              CHỈNH SỬA
            </Button>,
          )
        }

        // lecuturer confirm
        if (
          profile.roleName === ROLE.lecturer &&
          r.status === evaluationStatus.ConfirmEvaluationStatus
        ) {
          const isValidDeadline = validateDeadline(
            getDeadline(r, ROLE.lecturer).split(' - ').pop(),
          )
          actions.push(
            <Tooltip
              key="lecuturer confirm"
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
                  className="success ms-2"
                  type="primary"
                >
                  <i className="fas fa-check me-2" />
                  DUYỆT NGAY
                </Button>
              </Popconfirm>
            </Tooltip>,
          )
        }

        actions.push(
          <Button
            className="ms-2"
            key="default"
            onClick={() => gotoConfirmPage(r)}
          >
            <i className="fas fa-info me-2" />
            XEM
          </Button>,
        )

        return actions.map((a) => a)
      },
    },
  ]

  if (
    profile.roleName !== ROLE.lecturer &&
    profile.roleName !== ROLE.employee
  ) {
    columns = columns.filter((c) => c.key !== 'studentClass')
  }

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
          style={{ width: '100%' }}
          value={yearId && semesterId ? `${yearId}-${semesterId}` : null}
        >
          {evaluationBatches.map((evaluationBatch) => (
            <Select.Option
              key={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
              value={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
            >
              {`${evaluationBatch.semester.title}, ${evaluationBatch.year.title}`}
            </Select.Option>
          ))}
        </Select>

        {!checkIsCurrentActive(yearId, semesterId) && (
          <Button
            onClick={() => {
              const curr = getCurrentActive(evaluationBatches)
              if (curr) {
                setYearId(curr.year.id)
                setSemesterId(curr.semester.id)
              }
            }}
            type="primary"
            className="mt-2"
            block
          >
            LẤY HIỆN TẠI
          </Button>
        )}
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
    if (search.studentClass) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.student.studentClass.title === search.studentClass,
      )
    }
    if (search.reasonForCancellation) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.reasonForCancellation === search.reasonForCancellation,
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
      <div>{renderSelectBatch(evaluationBatches)}</div>

      <Divider />

      {filteredEvaluationList && (
        <div>
          <div className="d-flex justify-content-between flex-wrap">
            <div className="d-flex flex-wrap">
              {profile.roleName === ROLE.lecturer && (
                <div className="me-2 mb-2">
                  <Select
                    allowClear
                    onChange={(v) => setSearch({ ...search, studentClass: v })}
                    placeholder="Chọn lớp"
                    style={{ width: '100%' }}
                  >
                    {studentClasses.map((c) => (
                      <Select.Option key={c} value={c}>
                        {c}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}
              <Input
                onChange={(e) =>
                  setSearch({ ...search, fullName: e.target.value })
                }
                allowClear
                className="me-2 mb-2"
                style={{ width: 200 }}
                placeholder="Tên SV"
              />
              <Input
                onChange={(e) => setSearch({ ...search, code: e.target.value })}
                allowClear
                className="me-2 mb-2"
                style={{ width: 200 }}
                placeholder="MSSV"
              />
              <Select
                onChange={(v) => setSearch({ ...search, status: v })}
                placeholder="Trạng thái"
                className="me-2 mb-2"
                style={{ width: 150 }}
                allowClear
              >
                {Object.keys(evaluationStatus).map((k) => (
                  <Select.Option key={k} value={evaluationStatus[k]}>
                    {evaluationStatus[k]}
                  </Select.Option>
                ))}
              </Select>
              <Select
                onChange={(v) =>
                  setSearch({ ...search, reasonForCancellation: v })
                }
                placeholder="Phiếu hủy"
                className="me-2 mb-2"
                style={{ width: 150 }}
                allowClear
              >
                {reasonForCancellation.map((c) => (
                  <Select.Option key={c} value={c}>
                    {c}
                  </Select.Option>
                ))}
              </Select>
              <Select
                onChange={(v) => setSearch({ ...search, classification: v })}
                placeholder="Xếp loại"
                className="me-2 mb-2"
                style={{ width: 120 }}
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
            scroll={{ x: '600px' }}
          />
        </div>
      )}
    </Card>
  )
}

export default EvaluationList
