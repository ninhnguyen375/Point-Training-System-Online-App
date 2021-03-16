import {
  Button,
  Card,
  Divider,
  InputNumber,
  message,
  notification,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import handleError from '../../../common/utils/handleError'
import {
  getEvaluationPrivateService,
  getPointOnlineService,
  getPointTrainingGroupsService,
  getYearsService,
} from '../services'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../user/model'
import { disableEvaluationItems, semesters } from '../model'
import { cloneObj } from '../../../common/utils/object'

const EvaluationTicket = ({ student }) => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [studentEvaluation, setStudentEvaluation] = useState(null)
  console.log('~ studentEvaluation', studentEvaluation)
  const [monitorEvaluation, setMonitorEvaluation] = useState(null)
  const [displayEvaluationTicket, setDisplayEvaluationTicket] = useState([])
  const [previousResult, setPreviousResult] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [years, setYears] = useState([])
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [loading, setLoading] = useState(false)
  // ref
  const inputPreviousResult = useRef(null)

  const { isMonitor } = profile
  const isTicketOfMonitor = isMonitor && !student.id

  const mapToEvaluationTicket = (data = []) => {
    const displayEvalutionTicket = []
    const evaluationData = []
    const clone = [...data]

    clone.forEach((d) => {
      const evaluationDataItem = []

      displayEvalutionTicket.push({
        ...d,
        class: 'fw-bold',
        id: `main_${d.id}`,
        title: `${d.title} (tối đa ${d.maxPoint} điểm)`,
      })

      if (d.pointTrainingItemList) {
        d.pointTrainingItemList.forEach((item) => {
          displayEvalutionTicket.push({ ...item, class: 'fw-bold' })

          if (item.childrenItemList) {
            item.childrenItemList.forEach((child) => {
              evaluationDataItem.push({
                id: child.id,
                title: child.title,
                parentId: d.id,
                point: 0,
              })
              displayEvalutionTicket.push({ ...child, class: '' })
            })
          } else {
            evaluationDataItem.push({
              id: item.id,
              title: item.title,
              parentId: d.id,
              point: 0,
            })
          }
        })
      }

      evaluationData.push({
        id: `main_${d.id}`,
        maxPoint: d.maxPoint,
        point: 0,
        isAnotherItem: d.isAnotherItem,
        currentPoint: 0,
        items: evaluationDataItem,
      })
    })

    return {
      evaluationData,
      displayEvalutionTicket,
    }
  }

  const validatePoint = (cloneEvaluationTicket) => {
    let isValid = true

    cloneEvaluationTicket.every((group) => {
      const cloneGroup = JSON.parse(JSON.stringify(group))
      const totalPoint = group.items.reduce((sum, item) => sum + item.point, 0)

      if (totalPoint > cloneGroup.maxPoint) {
        isValid = false
        return false
      }

      return true
    })

    return isValid
  }

  const getTotalPoint = (clone = []) => {
    let total = 0
    if (!clone) {
      return 0
    }

    clone.forEach((group) => {
      if (group.isAnotherItem) {
        total += group.point
      } else {
        total += group.items.reduce((sum, item) => sum + item.point, 0)
      }
    })

    return total > 100 ? 100 : total
  }

  const getEvaluationPrivate = useCallback(async (yId, sId) => {
    try {
      let evaluationPrivate = await getEvaluationPrivateService({
        studentId: student.id || profile.id,
        semesterId: sId,
        yearId: yId,
      })
      evaluationPrivate = evaluationPrivate.data.data
      let pointTrainingGroups = await getPointTrainingGroupsService()
      pointTrainingGroups = pointTrainingGroups.data.data

      setEvaluation(evaluationPrivate)
      const mapped = mapToEvaluationTicket(pointTrainingGroups)

      setMonitorEvaluation(
        evaluationPrivate.monitorEvaluation || mapped.evaluationData,
      )
      setStudentEvaluation(
        evaluationPrivate.studentEvaluation || mapped.evaluationData,
      )
      setDisplayEvaluationTicket(mapped.displayEvalutionTicket)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  const getYears = useCallback(async () => {
    try {
      const { data } = await getYearsService()
      setYears(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getYears()
  }, [getYears])

  useEffect(() => {
    if (yearId && semesterId) {
      getEvaluationPrivate(yearId, semesterId)
    }
  }, [getEvaluationPrivate, yearId, semesterId])

  const getEvaluationWithNewPoint = (id, point, clone) => {
    const newEvaluationTicket = clone.map((group) => {
      if (group.id === id) {
        return { ...group, point }
      }

      const cloneGroup = cloneObj(group)

      const itemIndex = cloneGroup.items.findIndex((item) => item.id === id)

      if (itemIndex !== -1) {
        cloneGroup.items[itemIndex].point = point
      }

      return {
        ...cloneGroup,
        currentPoint: cloneGroup.currentPoint + point,
      }
    })

    if (!validatePoint(newEvaluationTicket)) {
      notification.error({ message: 'Điểm vượt quá mức tối đa' })
      return clone
    }

    return newEvaluationTicket
  }

  const handleChangePoint = (evaluationId, point, forStudent) => {
    const newEvaluation = getEvaluationWithNewPoint(
      evaluationId,
      point,
      cloneObj(forStudent ? studentEvaluation : monitorEvaluation),
    )

    if (forStudent) {
      setStudentEvaluation(newEvaluation)
    } else {
      setMonitorEvaluation(newEvaluation)
    }
  }

  const applyPoint = (point) => {
    const clone = cloneObj(isMonitor ? monitorEvaluation : studentEvaluation)
    let newEvaluation
    // reset point
    newEvaluation = getEvaluationWithNewPoint(2, 0, clone)
    newEvaluation = getEvaluationWithNewPoint(3, 0, newEvaluation)
    newEvaluation = getEvaluationWithNewPoint(4, 0, newEvaluation)
    newEvaluation = getEvaluationWithNewPoint(5, 0, newEvaluation)

    // apply point
    if (point >= 3.6 && point <= 4.0) {
      newEvaluation = getEvaluationWithNewPoint(2, 14, newEvaluation)
    } else if (point >= 3.2 && point <= 3.59) {
      newEvaluation = getEvaluationWithNewPoint(3, 12, newEvaluation)
    } else if (point >= 2.5 && point <= 3.19) {
      newEvaluation = getEvaluationWithNewPoint(4, 10, newEvaluation)
    } else if (point >= 2.0 && point <= 2.49) {
      newEvaluation = getEvaluationWithNewPoint(5, 5, newEvaluation)
    }

    if (isMonitor) {
      setMonitorEvaluation(newEvaluation)
    } else {
      setStudentEvaluation(newEvaluation)
    }
  }

  useEffect(() => {
    if (previousResult !== null) {
      applyPoint(previousResult)
    }
  }, [previousResult])

  const getEvaluationTicketItemById = (id, src) => {
    let item = {}

    if (!src) {
      return {}
    }

    src.every((ticket) => {
      const found =
        ticket.id === id ? ticket : ticket.items.find((a) => a.id === id)
      if (found) {
        item = found
        return false
      }
      return true
    })

    return item
  }

  const renderInputPoint = (r, forStudent) => {
    if ((r.point !== null && r.point !== undefined) || r.isAnotherItem) {
      return (
        <InputNumber
          style={{ width: 55 }}
          disabled={
            (!forStudent && !isMonitor) || disableEvaluationItems.includes(r.id)
          }
          min={r.isAnotherItem ? 0 : r.point > 0 ? 0 : -100}
          max={r.isAnotherItem ? r.maxPoint : r.point > 0 ? r.point : 0}
          defaultValue={0}
          value={
            getEvaluationTicketItemById(
              r.id,
              forStudent ? studentEvaluation : monitorEvaluation,
            ).point || 0
          }
          onChange={(v) => handleChangePoint(r.id, v, forStudent)}
        />
      )
    }

    return ''
  }

  const columns = [
    {
      key: 'id',
      title: 'MÃ',
      align: 'center',
      render: (r) =>
        (r.point !== null && r.point !== undefined) || r.isAnotherItem
          ? r.id
          : '',
    },
    {
      key: 0,
      title: 'NỘI DUNG ĐÁNH GIÁ',
      width: '50vw',
      render: (r) => (
        <div className={r.class}>
          <div className="me-2 d-inline">{r.title}</div>
        </div>
      ),
    },
    {
      key: 1,
      title: 'Điểm',
      align: 'center',
      render: (r) => (r.isAnotherItem ? r.maxPoint : r.point),
    },
    {
      key: 2,
      title: 'Điểm SV tự đánh giá',
      align: 'center',
      render: (r) => renderInputPoint(r, true),
    },
    {
      key: 3,
      title: 'Lớp trưởng đánh giá',
      align: 'center',
      render: (r) => renderInputPoint(r, false),
    },
  ]

  const handleGetPointOnline = async () => {
    setLoading(true)

    const code = student.code || profile.code
    try {
      const { data } = await getPointOnlineService(code)
      if (!data) {
        notification.info({
          message: `Chưa có điểm cho MSSV ${code}`,
          description: 'Hãy thử lại sau',
        })
      } else {
        applyPoint(parseFloat(data))
        message.success('Lấy điểm thành công')
        setPreviousResult(parseFloat(data))
      }
    } catch (err) {
      notification.info({
        message: `Chưa có điểm cho MSSV ${code}`,
        description: 'Hãy thử lại sau',
      })
    }

    setLoading(false)
  }

  const renderTicket = (cols, display, ev) => {
    if (!ev) {
      return ''
    }

    return (
      <div>
        <div>
          <div className="mt-2">
            <b>Họ tên:</b>
            {' '}
            {profile.fullName || 'sv'}
          </div>
          <div className="mt-2">
            <b>MSSV:</b>
            {' '}
            {profile.code || 'sv'}
          </div>
          <div className="mt-2">
            <b>Nhập hệ 4 học kỳ trước (VD: 2.5):</b>
            <div className="mt-2">
              <InputNumber
                ref={inputPreviousResult}
                min={0}
                max={4}
                placeholder="Điểm học kỳ trước"
                style={{ width: 155 }}
                onChange={(v) => setPreviousResult(v)}
                value={previousResult}
              />
              <Button
                loading={loading}
                onClick={handleGetPointOnline}
                className="ms-2"
                type="primary"
              >
                {loading ? 'ĐANG LẤY ĐIỂM' : 'LẤY ĐIỂM TỰ ĐỘNG'}
              </Button>
            </div>
          </div>
        </div>
        <Table
          bordered
          className="mt-3"
          rowKey={(r) => r.id}
          size="small"
          pagination={false}
          columns={cols}
          dataSource={display}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3}>
                <b>
                  <div className="text-center">Tổng cộng</div>
                </b>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <b>
                  <div className="text-center">
                    {getTotalPoint(studentEvaluation)}
                  </div>
                </b>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <b>
                  <div className="text-center">
                    {getTotalPoint(monitorEvaluation)}
                  </div>
                </b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        <div className="d-flex justify-content-end mt-4">
          <Button className="me-2">LƯU NHÁP</Button>
          <Button
            type="primary"
            onClick={() => {
              if (previousResult === null && inputPreviousResult.current) {
                message.error('Vui lòng nhập điểm hệ 4')
                inputPreviousResult.current.focus()
              } else {
                console.log(
                  getTotalPoint(
                    isMonitor ? monitorEvaluation : studentEvaluation,
                  ),
                )
              }
            }}
          >
            HOÀN TẤT
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card
      title={
        <span>
          <b>TỰ ĐÁNH GIÁ RÈN LUYỆN </b>
          - Sinh viên thực hiện đánh giá đến hết
          ngày
          {' '}
          <b className="text-danger">
            {profile.deadlineDate || moment().format('DD/MM/yyyy').toString()}
          </b>
        </span>
      }
    >
      <div className="row">
        <div className="col-lg-3">
          <div>Chọn năm học:</div>
          <Select
            onChange={(v) => setYearId(v)}
            placeholder="Chọn năm học"
            style={{ width: '100%' }}
          >
            {years[0] &&
              years.map((y) => (
                <Select.Option key={y.id} value={y.id}>
                  {y.title}
                </Select.Option>
              ))}
          </Select>
        </div>
        <div className="col-lg-3">
          <div>Chọn học kỳ:</div>
          <Select
            onChange={(v) => setSemesterId(v)}
            placeholder="Chọn học kỳ"
            style={{ width: '100%' }}
          >
            {semesters.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.title}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="col-lg-6">
        <Divider />
      </div>

      {renderTicket(columns, displayEvaluationTicket, evaluation)}
    </Card>
  )
}

EvaluationTicket.propTypes = {
  student: PropTypes.objectOf(PropTypes.any),
}

EvaluationTicket.defaultProps = {
  student: {},
}

export default EvaluationTicket
