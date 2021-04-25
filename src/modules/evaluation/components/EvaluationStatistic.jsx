import {
  Button,
  Card,
  Divider,
  Input,
  message,
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
import ClassStatisticExport from './ClassStatisticExport'
import EvaluationStatisticExport from './EvaluationStatisticExport'
import CounterStatisticExport from './CounterStatisticExport'
import ExportCSV from '../../../common/components/widgets/ExportCSV'

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
      <div className="col-lg-2">
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

    const data = evaluations.filter(
      (e) => e.student.studentClass.title === search.studentClass,
    )

    // check valid
    const invalidItems = data.filter(
      (e) =>
        e.status !== evaluationStatus.Done &&
        e.status !== evaluationStatus.Canceled,
    )

    if (invalidItems.length > 0) {
      message.info('Còn sinh viên chưa hoàn thành đánh giá')
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
          evaluations={data}
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
        key: 'class-statistic-modal',
      },
    )
  }

  const handleClickExportEvaluationStatistic = () => {
    // check valid
    const invalidItems = evaluations.filter(
      (e) =>
        e.status !== evaluationStatus.Done &&
        e.status !== evaluationStatus.Canceled,
    )

    if (invalidItems.length > 0) {
      message.info('Còn sinh viên chưa hoàn thành đánh giá')
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
        key: 'evaluation-statistic-modal',
      },
    )
  }

  const handleClickExportCounterStatistic = () => {
    // check valid
    const invalidItems = evaluations.filter(
      (e) =>
        e.status !== evaluationStatus.Done &&
        e.status !== evaluationStatus.Canceled,
    )

    if (invalidItems.length > 0) {
      message.info('Còn sinh viên chưa hoàn thành đánh giá')
      return
    }

    let data = [...studentClasses]

    data = data.map((studentClass, index) => {
      const counter = {}
      const counterCanceled = {}
      const evalOfClass = evaluations.filter(
        (e) => e.student.studentClass.title === studentClass,
      )
      const canceledEvalOfClass = evalOfClass.filter(
        (e) => e.status === evaluationStatus.Canceled,
      )

      for (let i = 0; i < classification.length; i += 1) {
        const item = classification[i]
        counter[item] = evalOfClass.reduce(
          (prev, curr) => (curr.classification === item ? prev + 1 : prev),
          0,
        )
      }

      for (let i = 0; i < reasonForCancellation.length; i += 1) {
        const item = reasonForCancellation[i]
        counterCanceled[item] = canceledEvalOfClass.reduce(
          (prev, curr) =>
            curr.reasonForCancellation === item ? prev + 1 : prev,
          0,
        )
      }

      const canceledReasons = Object.keys(counterCanceled)
        .map((key) =>
          counterCanceled[key] > 0 ? `${counterCanceled[key]} ${key}` : null,
        )
        .filter((item) => item !== null)

      return {
        index: index + 1,
        title: studentClass,
        studentNumber: evalOfClass.length,
        [classification[0]]: counter[classification[0]],
        [classification[1]]: counter[classification[1]],
        [classification[2]]: counter[classification[2]],
        [classification[3]]: counter[classification[3]],
        [classification[4]]: counter[classification[4]],
        [classification[5]]: counter[classification[5]],
        canceled: canceledReasons.join(', '),
      }
    })

    window.Modal.show(
      <div
        style={{
          height: '85vh',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CounterStatisticExport
          studentClassCounters={data}
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
        key: 'evaluation-statistic-modal',
      },
    )
  }

  return (
    <Card
      title={
        <span>
          <b>DANH SÁCH PHIẾU ĐIỂM RÈN LUYỆN</b>
        </span>
      }
    >
      <div>{renderSelectBatch(evaluationBatches)}</div>

      <Divider />

      {evaluations && (
        <div className="d-flex flex-wrap">
          <div
            onClick={handleClickExportEvaluationStatistic}
            aria-hidden
            className="card-box card-box-primary me-4 mb-2"
          >
            <i className="fas fa-file-pdf" />
            XUẤT BẢNG ĐIỂM HK{semesterId}{' '}
            {getString(
              evaluationBatches.find((b) => b.year.id === yearId),
              'year.title',
            )}
          </div>
          <div
            onClick={handleClickExportClassStatistic}
            aria-hidden
            className="card-box card-box-primary me-4 mb-2"
          >
            <i className="fas fa-file-pdf" />
            XUẤT BẢNG ĐIỂM THEO LỚP
          </div>
          <div
            onClick={handleClickExportCounterStatistic}
            aria-hidden
            className="card-box card-box-primary me-4 mb-2"
          >
            <i className="fas fa-file-pdf" />
            XUẤT BẢNG THỐNG KÊ SỐ LƯỢNG
          </div>
          <ExportCSV
            jsonData={(filteredEvaluations || []).map((e) => ({
              Lớp: getString(e, 'student.studentClass.title'),
              MSSV: e.student.code,
              'Họ Tên': e.student.fullName,
              'Ngày Sinh': e.student.dateOfBirth,
              Điểm: e.conclusionPoint,
              'Ghi chú': e.classification || e.reasonForCancellation,
            }))}
            useButton={false}
            fileName="Bảng điểm đã lọc"
            type="primary"
          >
            <div aria-hidden className="card-box me-4 mb-2">
              <i className="fas fa-file-csv" />
              XUẤT DANH SÁCH ĐIỂM HIỆN TẠI
            </div>
          </ExportCSV>
        </div>
      )}

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
