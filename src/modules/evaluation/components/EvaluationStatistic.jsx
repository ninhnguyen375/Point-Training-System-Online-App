import {
  Button,
  Card,
  Divider,
  Input,
  notification,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import qs from 'query-string'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { number } from 'prop-types'
import handleError from '../../../common/utils/handleError'
import {
  a4,
  classification,
  evaluationStatus,
  evaluationStatusColor,
  reasonForCancellation,
} from '../model'
import {
  getEvaluationBatchListService,
  getEvaluationsService,
} from '../services'
import { getString } from '../../../common/utils/object'
import ClassStatisticExport from '../../../pages/ClassStatisticExport'
import EvaluationStatisticExport from '../../../pages/EvaluationStatisticExport'

const EvaluationStatistic = ({ yearIdProp, semesterIdProp }) => {
  // state
  const [yearId, setYearId] = useState(yearIdProp)
  const [semesterId, setSemesterId] = useState(semesterIdProp)
  const [evaluations, setEvaluations] = useState(null)
  const [filteredEvaluations, setFilteredEvaluation] = useState(null)
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const [studentClasses, setStudentClasses] = useState([])
  const [search, setSearch] = useState({})
  const [
    isShowTooltipSelectStudentClass,
    setIsShowTooltipSelectStudentClass,
  ] = useState(false)
  // ref
  const selectStudentClassRef = useRef(null)

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

      if (!yearId && !semesterId) {
        // default active select batch
        const currentActive = getCurrentActive(data)
        if (currentActive) {
          setYearId(currentActive.year.id)
          setSemesterId(currentActive.semester.id)
        }
      }
    } catch (err) {
      notification.info({
        message: 'Chưa có đợt đánh giá',
      })
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const getEvaluations = useCallback(async () => {
    if (!yearId || !semesterId) {
      return
    }

    try {
      const { data } = await getEvaluationsService({
        yearId,
        semesterId,
      })

      setStudentClasses(groupStudentClasses(data.data))
      setEvaluations(data.data)
      setFilteredEvaluation(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [yearId, semesterId])

  useEffect(() => {
    getEvaluations()
  }, [getEvaluations])

  const gotoConfirmPage = (r) => {
    history.push(
      `/evaluation/confirm?${qs.stringify({
        studentId: r.studentId,
        yearId: r.yearId,
        semesterId: r.semesterId,
      })}`,
    )
  }

  const columns = [
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
      render: (r) => (
        <Button
          className="ms-2"
          key="default"
          shape="circle"
          onClick={() => gotoConfirmPage(r)}
        >
          <i className="fas fa-info" />
        </Button>
      ),
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
            setYearId(parseInt(v.split('-')[0], 10))
            setSemesterId(parseInt(v.split('-')[1], 10))
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
    if (!evaluations) {
      return
    }

    let newEvaluationList = [...evaluations]

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

    setFilteredEvaluation(newEvaluationList)
  }, [search, evaluations])

  useEffect(() => {
    applySearch()
  }, [applySearch])

  const handleClickExportClassStatistic = () => {
    if (!search.studentClass) {
      selectStudentClassRef.current.focus()
      setIsShowTooltipSelectStudentClass(true)
      return
    }

    // check valid
    const invalidItems = evaluations.filter(
      (e) =>
        e.status !== evaluationStatus.Done &&
        e.status !== evaluationStatus.Canceled,
    )

    if (invalidItems.length > 0) {
      notification.error({ message: 'Lớp chưa hoàn thành đánh giá' })
      return
    }

    window.Modal.show(
      <div
        style={{
          height: '85vh',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ClassStatisticExport
          evaluations={evaluations.filter(
            (e) => e.student.studentClass.title === search.studentClass,
          )}
          batchTitle={`Học kỳ ${semesterId} - Năm học ${getString(
            evaluationBatches.find((b) => b.year.id === yearId),
            'year.title',
          )}`}
        />
      </div>,
      {
        title: <b>BẢNG ĐIỂM CỦA LỚP</b>,
        style: { top: 10 },
        width: a4.width + 40,
      },
    )
  }

  const handleClickExportEvaluationStatistic = () => {
    window.Modal.show(
      <div
        style={{
          height: '85vh',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <EvaluationStatisticExport
          evaluations={evaluations}
          batchTitle={`Học kỳ ${semesterId} - Năm học ${getString(
            evaluationBatches.find((b) => b.year.id === yearId),
            'year.title',
          )}`}
        />
      </div>,
      {
        title: <b>BẢNG ĐIỂM</b>,
        style: { top: 10 },
        width: a4.width + 40,
      },
    )
  }

  return (
    <Card
      size="small"
      title={
        <span>
          <b>DANH SÁCH PHIẾU ĐIỂM RÈN LUYỆN</b>
        </span>
      }
    >
      <div>{renderSelectBatch(evaluationBatches)}</div>

      <Divider />

      <div className="d-flex flex-wrap">
        <Button
          onClick={handleClickExportEvaluationStatistic}
          type="primary"
          className="success me-2 mb-2"
        >
          <i className="fas fa-file-pdf me-2" />
          XUẤT BẢNG ĐIỂM HK{semesterId}{' '}
          {getString(
            evaluationBatches.find((b) => b.year.id === yearId),
            'year.title',
          )}
        </Button>
        <Button
          onClick={handleClickExportClassStatistic}
          type="primary"
          className="success me-2 mb-2"
        >
          <i className="fas fa-file-pdf me-2" />
          XUẤT BẢNG ĐIỂM THEO LỚP
        </Button>
      </div>

      <Divider />

      {filteredEvaluations && (
        <div>
          <div className="d-flex justify-content-between flex-wrap">
            <div className="d-flex flex-wrap">
              <div className="me-2 mb-2">
                <Tooltip
                  visible={isShowTooltipSelectStudentClass}
                  title="Chọn lớp để xuất bảng điểm theo lớp"
                  placement="topRight"
                >
                  <Select
                    allowClear
                    onChange={(v) => {
                      setSearch({ ...search, studentClass: v })
                      setIsShowTooltipSelectStudentClass(false)
                    }}
                    placeholder="Chọn lớp"
                    style={{ width: '100%' }}
                    ref={selectStudentClassRef}
                  >
                    {studentClasses.map((c) => (
                      <Select.Option key={c} value={c}>
                        {c}
                      </Select.Option>
                    ))}
                  </Select>
                </Tooltip>
              </div>
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
                style={{ width: 150 }}
                placeholder="MSSV"
              />
              <Select
                onChange={(v) => setSearch({ ...search, status: v })}
                placeholder="Trạng thái"
                className="me-2 mb-2"
                style={{ width: 200 }}
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
            <Button onClick={() => getEvaluations()} type="primary">
              <i className="fas fa-sync me-2" />
              LÀM MỚI
            </Button>
          </div>
          <Table
            size="small"
            rowKey={(r) => r.id}
            dataSource={filteredEvaluations}
            columns={columns}
            scroll={{ x: '600px' }}
          />
        </div>
      )}
    </Card>
  )
}

EvaluationStatistic.propTypes = {
  semesterIdProp: number,
  yearIdProp: number,
}

EvaluationStatistic.defaultProps = {
  semesterIdProp: null,
  yearIdProp: null,
}

export default EvaluationStatistic
