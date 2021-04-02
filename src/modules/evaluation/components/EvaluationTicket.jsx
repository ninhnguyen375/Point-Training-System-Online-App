import {
  Alert,
  Button,
  Card,
  Divider,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  Upload,
} from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import readExcelFile from 'read-excel-file'
import PropTypes from 'prop-types'
import handleError from '../../../common/utils/handleError'
import {
  getEvaluationPrivateService,
  getPointOnlineService,
  uploadFileService,
  removeFileService,
  studentMakeDraftEvaluationService,
  studentMakeEvaluationService,
  monitorMakeEvaluationService,
  lecturerApproveService,
  complainService,
  getEvaluationBatchListService,
  validateDeadline,
  getDeadline,
} from '../services'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../user/model'
import {
  MODULE_NAME as MODULE_EVALUATION,
  disableEvaluationItems,
  evaluationStatus,
} from '../model'

import { cloneObj } from '../../../common/utils/object'
import { configs } from '../../../configs'

const EvaluationTicket = ({ studentIdProp, yearIdProp, semesterIdProp }) => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  const pointTrainingGroups = useSelector(
    (state) => state[MODULE_EVALUATION].pointTrainingGroup,
  )
  // state
  const [studentEvaluation, setStudentEvaluation] = useState(null)
  const [monitorEvaluation, setMonitorEvaluation] = useState(null)
  const [displayEvaluationTicket, setDisplayEvaluationTicket] = useState([])
  const [currentResult, setCurrentResult] = useState(null)
  const [previousResult, setPreviousResult] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [yearId, setYearId] = useState(yearIdProp)
  const [semesterId, setSemesterId] = useState(semesterIdProp)
  const [attachments, setAttachments] = useState([])
  const [note, setNote] = useState('')
  const [reasonRefuseComplain, setReasonRefuseComplain] = useState('')
  const [visibleRefuseComplain, setVisibleRefuseComplain] = useState(false)
  const [evaluationBatches, setEvaluationBatches] = useState([])
  // ref
  const inputCurrentResult = useRef(null)
  const inputPreviousResult = useRef(null)
  const inputNote = useRef(null)

  const studentId = studentIdProp || profile.id
  const { isMonitor } = profile
  const isTicketOfMonitor =
    isMonitor && evaluation && evaluation.studentId === profile.id
  const viewRole =
    isMonitor && !isTicketOfMonitor ? ROLE.monitor : profile.roleName
  const isShowNote =
    profile.roleName === ROLE.student &&
    (evaluation.status === evaluationStatus.AcceptEvaluationStatus ||
      evaluation.status === evaluationStatus.ComplainEvaluationStatus)

  const deadlineString = getDeadline(evaluation, viewRole)

  const getYourTurn = (evaluationData, role) => {
    if (!evaluationData) {
      return false
    }

    const evalStatus = evaluationData.status

    if (
      role === ROLE.monitor &&
      (evalStatus === evaluationStatus.SubmitEvaluationStatus ||
        evalStatus === evaluationStatus.ComplainEvaluationStatus ||
        evalStatus === evaluationStatus.ConfirmEvaluationStatus)
    ) {
      return true
    }

    if (
      role === ROLE.student &&
      (evalStatus === evaluationStatus.DraftEvaluationStatus ||
        evalStatus === evaluationStatus.SubmitEvaluationStatus ||
        evalStatus === evaluationStatus.NewEvaluationStatus)
    ) {
      return true
    }

    if (
      role === ROLE.lecturer &&
      evalStatus === evaluationStatus.ConfirmEvaluationStatus
    ) {
      return true
    }

    return false
  }

  const isYourTurn = getYourTurn(evaluation, viewRole)

  const isValidDeadline = validateDeadline(deadlineString.split(' - ').pop())

  const getEvaluationBatch = useCallback(async () => {
    try {
      let { data } = await getEvaluationBatchListService()
      data = data.data
      data = data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1))
      setEvaluationBatches(data)

      if (!yearId || !semesterId) {
        setYearId(data[0].year.id)
        setSemesterId(data[0].semester.id)
      }
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const validatePoint = (cloneEvaluationTicket) => {
    let isValid = true
    let k = 0

    cloneEvaluationTicket.every((group) => {
      const cloneGroup = JSON.parse(JSON.stringify(group))
      const totalPoint = group.items.reduce((sum, item) => sum + item.point, 0)

      if (totalPoint > cloneGroup.maxPoint) {
        isValid = false
        k = totalPoint - cloneGroup.maxPoint
        return false
      }

      return true
    })

    return { isValid, k }
  }

  const getEvaluationWithNewPoint = (id, point, clone) => {
    const newEvaluationTicket = clone.map((group) => {
      if (group.id === id) {
        return { ...group, point }
      }

      const cloneGroup = cloneObj(group)
      const itemIndex = cloneGroup.items.findIndex((item) => item.id === id)

      if (itemIndex !== -1) {
        cloneGroup.items[itemIndex].point = point

        const totalPoint = cloneGroup.items.reduce(
          (sum, item) => sum + item.point,
          0,
        )

        return {
          ...cloneGroup,
          currentPoint: totalPoint,
        }
      }

      return group
    })

    const validate = validatePoint(newEvaluationTicket)
    if (!validate.isValid) {
      const validPoint = point - validate.k
      notification.info({
        message: `Điểm vượt quá mức tối đa, lấy ${validPoint}đ`,
      })
      return getEvaluationWithNewPoint(id, validPoint, clone)
    }

    return newEvaluationTicket
  }

  const handleChangePoint = (evaluationId, point, forStudent) => {
    if (isTicketOfMonitor) {
      const newEvaluation = getEvaluationWithNewPoint(
        evaluationId,
        point,
        cloneObj(monitorEvaluation),
      )
      setStudentEvaluation(newEvaluation)
      setMonitorEvaluation(newEvaluation)
      return
    }
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

  const handleReadFile = async (file) => {
    if (!file) {
      return
    }

    try {
      const reader = await readExcelFile(file, {
        schema: {
          'Mã phụ mục': {
            prop: 'id',
            type: String,
            required: true,
          },
          'Tiêu đề phụ mục': {
            prop: 'Tiêu đề phụ mục',
            type: String,
            required: false,
          },
          'Tên sự kiện': {
            prop: 'Tên sự kiện',
            type: String,
            required: false,
          },
          MSSV: {
            prop: 'code',
            type: String,
            required: true,
          },
          'Điểm cộng': {
            prop: 'point',
            type: Number,
            required: true,
          },
        },
      })
      let { rows } = reader

      rows = rows.map((r, i) => ({ ...r, row: i + 2 }))

      const pointForStudent = rows.find(
        (r) => String(r.code) === String(evaluation.student.code),
      )

      if (pointForStudent && pointForStudent.id && pointForStudent.point) {
        notification.success({
          message: `Nhập thành công ${pointForStudent.point}đ tại mã mục ${pointForStudent.id}`,
        })
        handleChangePoint(pointForStudent.id, pointForStudent.point, false)
      } else {
        notification.info({
          message: 'Nhập thành công, sinh viên không tham gia sự kiện nào.',
        })
      }
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleChangeFileEvent = async (file) => {
    await handleReadFile(file.file.originFileObj)
  }

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
              displayEvalutionTicket.push({ ...child, class: 'ms-3' })
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

  const getEvaluationPrivate = useCallback(async (stuId, yId, sId, groups) => {
    try {
      let evaluationPrivate = await getEvaluationPrivateService({
        studentId: stuId,
        semesterId: sId,
        yearId: yId,
      })
      evaluationPrivate = evaluationPrivate.data.data

      setEvaluation(evaluationPrivate)
      const mapped = mapToEvaluationTicket(groups)

      setMonitorEvaluation(
        JSON.parse(evaluationPrivate.monitorEvaluation) ||
          mapped.evaluationData,
      )
      setStudentEvaluation(
        JSON.parse(evaluationPrivate.studentEvaluation) ||
          mapped.evaluationData,
      )
      setPreviousResult(evaluationPrivate.previousResult)
      setCurrentResult(evaluationPrivate.currentResult)
      setDisplayEvaluationTicket(mapped.displayEvalutionTicket)
      setNote(evaluationPrivate.note)

      // get attachments
      if (evaluationPrivate.attachments) {
        let atts = evaluationPrivate.attachments.split('?')
        atts = atts.map((a, i) => ({
          uid: i,
          name: a.split(':')[0],
          url: configs.APIHost + a.split(':')[1],
        }))
        setAttachments(atts)
      }
    } catch (err) {
      notification.info({
        message: 'Chưa có đợt đánh giá tại học kỳ bạn chọn',
      })
      setEvaluation(null)
    }
  }, [])

  useEffect(() => {
    if (yearId && semesterId) {
      getEvaluationPrivate(studentId, yearId, semesterId, pointTrainingGroups)
    }
  }, [getEvaluationPrivate, studentId, yearId, semesterId, pointTrainingGroups])

  const applyPoint = (prePoint, currPoint) => {
    const clone = cloneObj(isMonitor ? monitorEvaluation : studentEvaluation)
    let newEvaluation
    // reset point
    newEvaluation = getEvaluationWithNewPoint(2, 0, clone)
    newEvaluation = getEvaluationWithNewPoint(3, 0, newEvaluation)
    newEvaluation = getEvaluationWithNewPoint(4, 0, newEvaluation)
    newEvaluation = getEvaluationWithNewPoint(5, 0, newEvaluation)
    newEvaluation = getEvaluationWithNewPoint(8, 0, newEvaluation)
    newEvaluation = getEvaluationWithNewPoint(9, 0, newEvaluation)

    // apply with current point
    if (currPoint >= 3.6 && currPoint <= 4.0) {
      newEvaluation = getEvaluationWithNewPoint(2, 14, newEvaluation)
    } else if (currPoint >= 3.2 && currPoint <= 3.59) {
      newEvaluation = getEvaluationWithNewPoint(3, 12, newEvaluation)
    } else if (currPoint >= 2.5 && currPoint <= 3.19) {
      newEvaluation = getEvaluationWithNewPoint(4, 10, newEvaluation)
    } else if (currPoint >= 2.0 && currPoint <= 2.49) {
      newEvaluation = getEvaluationWithNewPoint(5, 5, newEvaluation)
    }

    // apply with previous point
    if (prePoint && currPoint >= 2 && currPoint - prePoint >= 2) {
      newEvaluation = getEvaluationWithNewPoint(9, 6, newEvaluation)
    } else if (prePoint && currPoint >= 2 && currPoint - prePoint >= 1) {
      newEvaluation = getEvaluationWithNewPoint(8, 3, newEvaluation)
    }

    if (isMonitor) {
      setMonitorEvaluation(newEvaluation)
    } else {
      setStudentEvaluation(newEvaluation)
    }
  }

  useEffect(() => {
    if (currentResult !== null) {
      applyPoint(parseFloat(previousResult), parseFloat(currentResult))
    }
  }, [currentResult])

  const getEvaluationTicketItemById = (id, src) => {
    let item = {}

    if (!src) {
      return {}
    }

    src.every((ticket) => {
      if (ticket.isAnotherItem && ticket.id === id) {
        item = ticket
        return false
      }

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
    const currItem = getEvaluationTicketItemById(
      r.id,
      forStudent ? studentEvaluation : monitorEvaluation,
    )

    if ((r.point !== null && r.point !== undefined) || r.isAnotherItem) {
      const style = {
        width: 55,
        outline: (currItem.point || 0) !== 0 ? '2px solid #49227d' : '',
      }
      const readOnly =
        (!forStudent && !isMonitor) ||
        (!isTicketOfMonitor && isMonitor && forStudent) ||
        profile.roleName === ROLE.lecturer ||
        evaluation.status === evaluationStatus.AcceptEvaluationStatus ||
        !isValidDeadline
      const min = r.isAnotherItem ? 0 : r.point > 0 ? 0 : -100
      const max = r.isAnotherItem ? r.maxPoint : r.point > 0 ? r.point : 0
      const value = currItem.point || 0
      const defaultValue = currItem.point || 0
      const onChange = (v) => handleChangePoint(r.id, v, forStudent)

      return (
        <InputNumber
          style={style}
          readOnly={readOnly}
          disabled={disableEvaluationItems.includes(r.id)}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      )
    }

    return r.maxPoint ? `${currItem.currentPoint}/${r.maxPoint}` : ''
  }

  const columns = [
    {
      key: 'id',
      title: <b>MÃ</b>,
      align: 'center',
      render: (r) =>
        (r.point !== null && r.point !== undefined) || r.isAnotherItem
          ? r.id
          : '',
    },
    {
      key: 0,
      title: <b>NỘI DUNG ĐÁNH GIÁ</b>,
      width: '50vw',
      render: (r) => (
        <div className={r.class}>
          <div className="me-2 d-inline">{r.title}</div>
        </div>
      ),
    },
    {
      key: 1,
      title: <b>Điểm</b>,
      align: 'center',
      render: (r) => (r.isAnotherItem ? r.maxPoint : r.point),
    },
    {
      key: 2,
      title: <b>Điểm SV tự đánh giá</b>,
      align: 'center',
      render: (r) => renderInputPoint(r, true),
    },
    {
      key: 3,
      title: <b>Lớp trưởng đánh giá</b>,
      align: 'center',
      render: (r) => renderInputPoint(r, false),
    },
  ]

  // eslint-disable-next-line no-unused-vars
  const handleGetPointOnline = async () => {
    const { code } = evaluation.student
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
        setCurrentResult(parseFloat(data))
      }
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleRemoveAttachment = async (file) => {
    try {
      await removeFileService(
        evaluation.id,
        file.url.split('/')[file.url.split('/').length - 1],
      )

      const newAtts = attachments.filter((a) => a.name !== file.name)
      setAttachments(newAtts)
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleAddAttachment = async ({ onSuccess, file }) => {
    try {
      const { data } = await uploadFileService(evaluation.id, file)

      setAttachments([
        ...attachments,
        {
          uid: data.data,
          name: data.data.split(':')[0],
          url: configs.APIHost + data.data.split(':')[1],
        },
      ])
      onSuccess()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleClickSaveAsDraft = async (notify = true) => {
    try {
      await studentMakeDraftEvaluationService(
        evaluation.id,
        JSON.stringify(studentEvaluation),
        previousResult,
        currentResult,
      )
      await getEvaluationPrivate(
        studentId,
        yearId,
        semesterId,
        pointTrainingGroups,
      )
      if (notify) {
        notification.success({ message: 'Lưu nháp thành công' })
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  const studentMakeEvaluation = async (evaluationId) => {
    try {
      await studentMakeEvaluationService(evaluationId)
      notification.success({
        message: 'Đánh giá thành công',
        description:
          'Bạn có thể khiếu nại sau khi lớp trưởng đánh giá phiếu của bạn',
      })
      await getEvaluationPrivate(
        studentId,
        yearId,
        semesterId,
        pointTrainingGroups,
      )
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const getClassification = (totalPoint) => {
    if (totalPoint >= 85) {
      return 'Tốt'
    }
    if (totalPoint >= 65 && totalPoint < 85) {
      return 'Khá'
    }
    if (totalPoint >= 50 && totalPoint < 65) {
      return 'Trung bình'
    }
    if (totalPoint >= 35 && totalPoint < 50) {
      return 'Yếu'
    }
    return 'Kém'
  }

  const monitorMakeEvaluation = async (noti = true, paramNote) => {
    try {
      const totalPoint = getTotalPoint(monitorEvaluation)
      await monitorMakeEvaluationService(
        evaluation.id,
        JSON.stringify(monitorEvaluation),
        previousResult,
        currentResult,
        totalPoint,
        getClassification(totalPoint),
        paramNote,
      )
      if (noti) {
        notification.success({
          message: 'Lớp trưởng đánh giá thành công',
        })
      }
      await getEvaluationPrivate(
        studentId,
        yearId,
        semesterId,
        pointTrainingGroups,
      )
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleSubmit = async () => {
    // for student
    if (profile.roleName === ROLE.student) {
      // for monitor
      if (isMonitor) {
        // validate
        if (currentResult === null) {
          message.error('Vui lòng nhập điểm hệ 4')
          inputCurrentResult.current.focus()
          return
        }
        if (previousResult === null) {
          message.error('Vui lòng nhập điểm hệ 4')
          inputPreviousResult.current.focus()
          return
        }
        monitorMakeEvaluation(
          true,
          evaluation.status === evaluationStatus.ComplainEvaluationStatus
            ? 'Đã sửa'
            : note,
        )
        return
      }

      // not monitor
      if (previousResult === null) {
        message.error('Vui lòng nhập điểm hệ 4')
        inputPreviousResult.current.focus()
        return
      }
      await handleClickSaveAsDraft(false)
      studentMakeEvaluation(evaluation.id)
    }
  }

  const handleLecturerApprove = async () => {
    try {
      await lecturerApproveService(evaluation.id)
      await getEvaluationPrivate(
        studentId,
        yearId,
        semesterId,
        pointTrainingGroups,
      )
      notification.success({
        message: 'Cố vấn học tập xét duyệt',
        description: 'Thành công',
      })
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleComplain = async () => {
    try {
      if (!note) {
        notification.info({ message: 'Vui lòng nhập Ghi chú khiếu nại' })
        inputNote.current.focus()
        return
      }
      await complainService(evaluation.id, note)
      notification.success({ message: 'Gửi khiếu nại thành công' })
      getEvaluationPrivate(studentId, yearId, semesterId, pointTrainingGroups)
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleRefuseComplain = async () => {
    // validate
    if (currentResult === null) {
      message.error('Vui lòng nhập điểm hệ 4')
      inputCurrentResult.current.focus()
      return
    }
    if (previousResult === null) {
      message.error('Vui lòng nhập điểm hệ 4')
      inputPreviousResult.current.focus()
      return
    }
    if (!reasonRefuseComplain) {
      message.info('Vui lòng nhập lý do từ chối')
      return
    }

    try {
      monitorMakeEvaluation(false, reasonRefuseComplain)
      setVisibleRefuseComplain(false)
      notification.success({
        message: 'Từ chối khiếu nại thành công',
      })
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const renderTicket = (cols, display) => (
    <div>
      <div>
        <div className="mt-2">
          <b>Họ tên: </b>
          {evaluation.student.fullName || 'sv'}
        </div>
        <div className="mt-2">
          <b>MSSV: </b>
          {evaluation.student.code || 'sv'}
        </div>
        <div className="mt-2">
          <b>Nhập điểm hệ 4 học kỳ trước (VD: 2.5):</b>
          <div className="mt-2 d-flex flex-wrap align-items-center">
            <InputNumber
              ref={inputPreviousResult}
              min={0}
              max={4}
              onChange={(v) => setPreviousResult(v)}
              value={previousResult}
              placeholder="Điểm hệ 4"
              readOnly={
                !isValidDeadline ||
                profile.roleName !== ROLE.student ||
                !isYourTurn
              }
            />
            <span className="me-2 ms-2">xem trên</span>
            <a
              target="blank"
              href={`http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${evaluation.student.code}`}
            >
              <b>thongtindaotao</b>
              <i className="fas fa-external-link-alt ms-2" />
            </a>
          </div>
        </div>
        <div className="mt-2">
          <b>
            <span className="me-2">Nhập điểm hệ 4 học kỳ hiện tại</span>
            {isMonitor ? '' : '(bỏ trống nếu chưa có)'}
            <span>:</span>
          </b>
          <div className="mt-2 d-flex flex-wrap align-items-center">
            <InputNumber
              ref={inputCurrentResult}
              min={0}
              max={4}
              onChange={(v) => setCurrentResult(v)}
              value={currentResult}
              placeholder="Điểm hệ 4"
              readOnly={
                !isValidDeadline ||
                profile.roleName !== ROLE.student ||
                !isYourTurn
              }
            />
            <span className="me-2 ms-2">xem trên</span>
            <a
              target="blank"
              href={`http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${evaluation.student.code}`}
            >
              <b>thongtindaotao</b>
              <i className="fas fa-external-link-alt ms-2" />
            </a>
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
        scroll={{ x: 360 }}
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

      <div className="mt-4 d-flex flex-wrap">
        <div style={{ maxWidth: 318 }} className="card p-3 me-3 mt-2">
          <Upload
            customRequest={handleAddAttachment}
            onRemove={handleRemoveAttachment}
            fileList={attachments}
            disabled={profile.roleName !== ROLE.student}
            accept="image/*"
            onPreview={(file) => {
              window.Modal.show(
                <div
                  style={{
                    background: `url('${file.url}')`,
                    width: '100%',
                    height: '90vh',
                    backgroundSize: 'contant',
                  }}
                />,
                {
                  title: 'HÌNH ẢNH',
                  width: '99vw',
                  height: '99vh',
                  style: {
                    top: '0.5vh',
                  },
                },
              )
            }}
          >
            <Button icon={<i className="fas fa-file-upload me-2" />}>
              Tải lên ảnh minh chứng
            </Button>
          </Upload>
        </div>
        {isShowNote && (
          <div style={{ maxWidth: 318 }} className="me-3 card p-3 mt-2">
            <div>Ghi chú:</div>
            <Input.TextArea
              onChange={(e) => setNote(e.target.value)}
              value={note}
              ref={inputNote}
              style={{ width: 284 }}
            />
          </div>
        )}
        {isMonitor && (
          <div style={{ maxWidth: 318 }} className="mt-2 text-end">
            <Upload
              disabled={
                evaluation.status === evaluationStatus.AcceptEvaluationStatus ||
                !isValidDeadline
              }
              showUploadList={false}
              customRequest={({ onSuccess }) => onSuccess()}
              onChange={handleChangeFileEvent}
              fileList={[]}
            >
              <Button
                disabled={
                  evaluation.status ===
                    evaluationStatus.AcceptEvaluationStatus || !isValidDeadline
                }
                type="primary"
                icon={<i className="fas fa-file-import me-2" />}
              >
                NHẬP ĐIỂM TỪ FILE SỰ KIỆN
              </Button>
            </Upload>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end mt-3">
        {viewRole === ROLE.student && !(isYourTurn && !isValidDeadline) && (
          <Alert
            message={
              <div>
                {evaluation.status === evaluationStatus.NewEvaluationStatus &&
                  'Bạn có thể LƯU NHÁP hoặc chọn HOÀN TẤT để lớp trưởng đánh giá.'}
                {evaluation.status === evaluationStatus.DraftEvaluationStatus &&
                  !isMonitor &&
                  !isTicketOfMonitor &&
                  'Phiếu hiện tại đang là NHÁP, chọn HOÀN TẤT để lớp trưởng đánh giá.'}
                {evaluation.status ===
                  evaluationStatus.SubmitEvaluationStatus &&
                  !isMonitor &&
                  !isTicketOfMonitor &&
                  'Bạn đã hoàn tất phiếu đánh giá, phiếu đang chờ lớp trưởng đánh giá, bạn có thể chỉnh sửa trong khoản thời gian này.'}
                {evaluation.status ===
                  evaluationStatus.ConfirmEvaluationStatus &&
                  !isMonitor &&
                  !isTicketOfMonitor &&
                  'Lớp trưởng đã đánh giá phiếu của bạn, bạn có thể khiếu nại nếu thấy sai sót.'}
              </div>
            }
            type="success"
          />
        )}

        {isYourTurn && !isValidDeadline && (
          <Alert message="Phiếu đóng vì quá hạn" type="error" />
        )}
      </div>

      <div className="d-flex justify-content-end mt-3">
        {(evaluation.status === evaluationStatus.NewEvaluationStatus ||
          evaluation.status === evaluationStatus.DraftEvaluationStatus ||
          evaluation.status === evaluationStatus.SubmitEvaluationStatus) && (
          <>
            {viewRole === ROLE.student && (
              <Button
                disabled={!isValidDeadline}
                onClick={handleClickSaveAsDraft}
                size="large"
                className="me-2"
              >
                LƯU NHÁP
              </Button>
            )}
            {(viewRole === ROLE.student || viewRole === ROLE.monitor) && (
              <Popconfirm
                disabled={!isValidDeadline}
                title="HOÀN TẤT đánh giá?"
                onConfirm={handleSubmit}
              >
                <Button
                  disabled={!isValidDeadline}
                  className="success"
                  size="large"
                  type="primary"
                >
                  HOÀN TẤT
                </Button>
              </Popconfirm>
            )}
          </>
        )}

        {(evaluation.status === evaluationStatus.ConfirmEvaluationStatus ||
          evaluation.status === evaluationStatus.ComplainEvaluationStatus) &&
          isMonitor && (
            <>
              {evaluation.status ===
              evaluationStatus.ComplainEvaluationStatus ? (
                <Button
                  disabled={!isValidDeadline}
                  onClick={() => setVisibleRefuseComplain(true)}
                  className="me-2"
                  size="large"
                >
                  TỪ CHỐI KHIẾU NẠI
                </Button>
              ) : (
                ''
              )}
              <Popconfirm
                disabled={!isValidDeadline}
                title="CẬP NHẬT đánh giá?"
                onConfirm={handleSubmit}
              >
                <Button
                  disabled={!isValidDeadline}
                  className="success"
                  size="large"
                  type="primary"
                >
                  CẬP NHẬT
                </Button>
              </Popconfirm>
            </>
          )}

        {evaluation.status === evaluationStatus.ConfirmEvaluationStatus &&
          profile.roleName === ROLE.lecturer && (
            <Popconfirm
              disabled={!isValidDeadline}
              title="DUYỆT đánh giá?"
              onConfirm={handleLecturerApprove}
            >
              <Button
                disabled={!isValidDeadline}
                className="success"
                size="large"
                type="primary"
              >
                DUYỆT ĐÁNH GIÁ
              </Button>
            </Popconfirm>
          )}

        {evaluation.status === evaluationStatus.ConfirmEvaluationStatus &&
          profile.roleName === ROLE.student &&
          !isMonitor && (
            <Button
              onClick={handleComplain}
              size="large"
              className="me-2"
              type="primary"
            >
              KHIẾU NẠI
            </Button>
          )}
      </div>
    </div>
  )

  return (
    <Card
      size="small"
      title={
        <span>
          <b>PHIẾU ĐIỂM RÈN LUYỆN</b>
        </span>
      }
    >
      <div className="d-flex justify-content-between flex-wrap">
        <div className="col-lg-4">
          {evaluationBatches[0] && (
            <>
              <div>Chọn học kỳ:</div>
              <Select
                disabled={
                  evaluation &&
                  !(
                    profile.id === evaluation.studentId &&
                    (!isMonitor || isTicketOfMonitor)
                  )
                }
                onChange={(v) => {
                  setYearId(v.split('-')[0])
                  setSemesterId(v.split('-')[1])
                }}
                style={{ width: '100%' }}
                placeholder="Chọn học kỳ"
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
            </>
          )}
        </div>

        {deadlineString && (
          <Alert
            message={`Hạn chót ${viewRole}: ${deadlineString} ${
              isYourTurn && !isValidDeadline ? '(quá hạn)' : ''
            }`}
            className="mt-2"
            type={isYourTurn ? (isValidDeadline ? 'success' : 'error') : ''}
          />
        )}
      </div>

      {evaluationBatches[0] && (
        <Alert
          className="mt-2 col-lg-4"
          message="Chọn lại Năm học và Học kỳ nếu chưa chính xác"
          type="error"
        />
      )}

      <Divider />

      {evaluation && (
        <Tooltip placement="topLeft" title="Tổng dựa trên lớp trưởng đánh giá">
          <div className="tag-total-point">
            <div className="me-2">
              <span className="me-2">Tổng:</span>
              <b>{`${getTotalPoint(monitorEvaluation)}đ`}</b>
              <span className="me-2 ms-2">- Xếp loại:</span>
              <b>{evaluation.classification || '--'}</b>
            </div>
            <div className="tag-total-point__status">
              <b>{evaluation.status.toUpperCase()}</b>
            </div>
          </div>
        </Tooltip>
      )}

      <Divider />

      {evaluation && renderTicket(columns, displayEvaluationTicket)}

      <Modal
        onCancel={() => setVisibleRefuseComplain(false)}
        title={<b>TỪ CHỐI KHIẾU NẠI</b>}
        visible={visibleRefuseComplain}
        onOk={handleRefuseComplain}
      >
        <div>
          <div>Nhập lý do từ chối:</div>
          <Input.TextArea
            onChange={(e) => setReasonRefuseComplain(e.target.value)}
            placeholder="Nhập lý do từ chối"
          />
        </div>
      </Modal>
    </Card>
  )
}

EvaluationTicket.propTypes = {
  studentIdProp: PropTypes.number,
  yearIdProp: PropTypes.number,
  semesterIdProp: PropTypes.number,
}

EvaluationTicket.defaultProps = {
  studentIdProp: null,
  yearIdProp: null,
  semesterIdProp: null,
}

export default EvaluationTicket
