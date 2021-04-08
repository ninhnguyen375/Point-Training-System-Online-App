import {
  Alert,
  Button,
  Card,
  Divider,
  InputNumber,
  message,
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
  lecturerConfirmService,
  complainService,
  getEvaluationBatchListService,
  validateDeadline,
  getDeadline,
  getNote,
  employeeConfirmService,
} from '../services'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../user/model'
import {
  MODULE_NAME as MODULE_EVALUATION,
  disableEvaluationItems,
  evaluationStatus,
} from '../model'

import { cloneObj } from '../../../common/utils/object'
import { configs } from '../../../configs'
import ChoosePointTrainingItemId from './ChoosePointTrainingItemId'
import TextAreaForm from '../../../common/components/widgets/TextAreaForm'

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
  const [evaluationBatches, setEvaluationBatches] = useState([])
  // ref
  const inputCurrentResult = useRef(null)
  const inputPreviousResult = useRef(null)

  const studentId = studentIdProp || profile.id
  const isTicketOfCurrentStudent =
    evaluation && evaluation.studentId === profile.id
  const { isMonitor } = profile
  const isTicketOfMonitor = evaluation && isMonitor && isTicketOfCurrentStudent
  const viewRole =
    isMonitor && !isTicketOfMonitor ? ROLE.monitor : profile.roleName
  const isShowNote =
    evaluation &&
    (evaluation.status === evaluationStatus.MonitorConfirmed ||
      evaluation.status === evaluationStatus.LecturerConfirmed ||
      evaluation.status === evaluationStatus.EmployeeConfirmed ||
      evaluation.status === evaluationStatus.ComplainingMonitor ||
      evaluation.status === evaluationStatus.ComplainingLecturer ||
      evaluation.status === evaluationStatus.ComplainingEmployee)
  const isMySubmited =
    evaluation &&
    ((viewRole === ROLE.monitor &&
      evaluation.status === evaluationStatus.MonitorConfirmed) ||
      (viewRole === ROLE.lecturer &&
        evaluation.status === evaluationStatus.LecturerConfirmed) ||
      (viewRole === ROLE.employee &&
        evaluation.status === evaluationStatus.EmployeeConfirmed))
  const isComplainMe =
    evaluation &&
    ((viewRole === ROLE.monitor &&
      evaluation.status === evaluationStatus.ComplainingMonitor) ||
      (viewRole === ROLE.lecturer &&
        evaluation.status === evaluationStatus.ComplainingLecturer) ||
      (viewRole === ROLE.employee &&
        evaluation.status === evaluationStatus.ComplainingEmployee))

  const deadlineString = getDeadline(evaluation, viewRole)

  const getCurrentActive = (batches = []) => batches.find((b) => b.isInDeadline)

  const checkIsCurrentActive = (yId, sId, batches) => {
    const found = batches.find(
      (b) =>
        parseInt(b.year.id, 10) === parseInt(yId, 10) &&
        parseInt(b.semester.id, 10) === parseInt(sId, 10),
    )

    if (found) {
      return found.isInDeadline
    }

    return false
  }

  const checkYourTurn = (role) => {
    if (!evaluation) {
      return false
    }

    const evalStatus = evaluation.status

    if (
      role === ROLE.monitor &&
      (evalStatus === evaluationStatus.StudentSubmited ||
        evalStatus === evaluationStatus.ComplainingMonitor ||
        evalStatus === evaluationStatus.MonitorConfirmed)
    ) {
      return true
    }

    if (
      role === ROLE.student &&
      (evalStatus === evaluationStatus.Draft ||
        evalStatus === evaluationStatus.StudentSubmited ||
        evalStatus === evaluationStatus.New)
    ) {
      return true
    }

    if (
      role === ROLE.lecturer &&
      evalStatus === evaluationStatus.MonitorConfirmed
    ) {
      return true
    }

    if (
      role === ROLE.employee &&
      evalStatus === evaluationStatus.StudentSubmited &&
      evaluation.overdue
    ) {
      return true
    }

    return false
  }

  const isYourTurn = checkYourTurn(viewRole)

  const isValidDeadline =
    evaluation &&
    validateDeadline(deadlineString.split(' - ').pop()) &&
    evaluation.isInDeadline

  const getEvaluationBatch = useCallback(async () => {
    try {
      let { data } = await getEvaluationBatchListService()
      data = data.data
      data = data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1))
      setEvaluationBatches(data)

      if (!yearId || !semesterId) {
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

      if (evaluation && evaluation.status === evaluationStatus.New) {
        setStudentEvaluation(newEvaluation)
      }

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
        id: `A${d.id}`,
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
        id: `A${d.id}`,
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

    // ticket of monitor
    if (isTicketOfMonitor) {
      setMonitorEvaluation(newEvaluation)
      setStudentEvaluation(newEvaluation)
      return
    }

    // student
    if (viewRole === ROLE.student) {
      setStudentEvaluation(newEvaluation)
      return
    }

    // other
    setMonitorEvaluation(newEvaluation)
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

  const handleRemoveAttachment = async (attachment) => {
    try {
      await removeFileService(
        evaluation.id,
        attachment.url.split('/')[attachment.url.split('/').length - 1],
      )

      const newAtts = attachments.filter((a) => a.name !== attachment.name)
      setAttachments(newAtts)
      message.success('Xóa thành công')
      window.Modal.clear()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleViewImage = (atts) => {
    window.Modal.show(
      <div>
        {atts.map((a) => (
          <div className="mt-2" key={a.url}>
            <div
              style={{
                backgroundImage: `url('${a.url}')`,
                maxWidth: '90vw',
                height: 300,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
            <div
              style={{ maxWidth: '90vw' }}
              className="d-flex justify-content-center"
            >
              <Button
                onClick={() => handleRemoveAttachment(a)}
                type="primary"
                danger
                size="small"
                style={{ borderRadius: '0 0 7px 7px' }}
              >
                <i className="fas fa-times me-2" />
                XÓA ẢNH
              </Button>
            </div>
          </div>
        ))}
      </div>,
      {
        title: 'MINH CHỨNG',
        width: '98vw',
        style: { maxWidth: 800, top: 10 },
      },
    )
  }

  const handleUploadAttachment = (r) => async ({ onSuccess, file }) => {
    try {
      const { data } = await uploadFileService(
        evaluation.id,
        file,
        `${r.id}_${file.name}`,
      )

      setAttachments([
        ...attachments,
        {
          uid: data.data,
          name: data.data.split(':')[0],
          url: configs.APIHost + data.data.split(':')[1],
        },
      ])

      message.success('Tải lên thành công')
      onSuccess()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const renderInputPoint = (r, forStudent) => {
    const currItem = getEvaluationTicketItemById(
      r.id,
      forStudent ? studentEvaluation : monitorEvaluation,
    )
    const isStudent = viewRole === ROLE.student && !isMonitor
    const isLecturer = viewRole === ROLE.lecturer
    const isEmployee = viewRole === ROLE.employee

    if ((r.point !== null && r.point !== undefined) || r.isAnotherItem) {
      const style = {
        width: 55,
        outline: (currItem.point || 0) !== 0 ? '2px solid #49227d' : '',
      }
      const readOnly =
        // col2 - student can't edit col2
        (!forStudent && isStudent) ||
        // col1 - monitor can't edit col1, but can edit own ticket
        (forStudent && isMonitor && !isTicketOfMonitor) ||
        // col1 - lecturer and employee can't edit col1
        (forStudent && (isLecturer || isEmployee)) ||
        // disable all by done
        evaluation.status === evaluationStatus.Done ||
        !isValidDeadline

      const min = r.isAnotherItem ? 0 : r.point > 0 ? 0 : -100
      const max = r.isAnotherItem ? r.maxPoint : r.point > 0 ? r.point : 0
      const value = currItem.point || 0
      const defaultValue = currItem.point || 0
      const onChange = (v) => handleChangePoint(r.id, v, forStudent)
      const attachment = attachments.filter(
        (a) => a.name.split('_')[0] === r.id,
      )

      return (
        <div>
          {forStudent && (
            <Upload
              customRequest={handleUploadAttachment(r)}
              fileList={attachments}
              disabled={
                profile.roleName !== ROLE.student ||
                (!isMonitor && !isTicketOfCurrentStudent)
              }
              showUploadList={false}
              accept="image/*"
            >
              <Tooltip title="Tải lên minh chứng">
                <i
                  className="fas fa-file-upload me-2"
                  style={{ marginLeft: '-1.2em', cursor: 'pointer' }}
                />
              </Tooltip>
            </Upload>
          )}
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
          {forStudent && attachment[0] && (
            <Tooltip title="Xem minh chứng">
              <i
                onClick={() => handleViewImage(attachment)}
                aria-hidden
                className="fas fa-image ms-2"
                style={{ marginRight: '-1.2em', cursor: 'pointer' }}
              />
            </Tooltip>
          )}
        </div>
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
      title: <b>Lớp đánh giá</b>,
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

  const handleAddAttachment = async ({ onSuccess, file }) => {
    const dataSource = displayEvaluationTicket

    window.Modal.show(
      <ChoosePointTrainingItemId
        dataSource={dataSource}
        onSubmit={async (trainingPointItemId) => {
          try {
            const { data } = await uploadFileService(
              evaluation.id,
              file,
              `${trainingPointItemId}_${file.name}`,
            )

            setAttachments([
              ...attachments,
              {
                uid: data.data,
                name: data.data.split(':')[0],
                url: configs.APIHost + data.data.split(':')[1],
              },
            ])

            onSuccess()

            window.Modal.clear()
          } catch (err) {
            handleError(err, null, notification)
          }
        }}
      />,
      {
        title: <b>CHỌN MỤC CỦA MINH CHỨNG</b>,
        width: '99vw',
        style: { top: 10, maxWidth: 600 },
      },
    )
  }

  const handleClickSaveAsDraft = async (notify = true) => {
    try {
      await studentMakeDraftEvaluationService(
        evaluation.id,
        JSON.stringify(isMonitor ? monitorEvaluation : studentEvaluation),
        previousResult,
        currentResult,
      )

      if (notify) {
        notification.success({ message: 'Lưu nháp thành công' })
      }

      getEvaluationPrivate(studentId, yearId, semesterId, pointTrainingGroups)
    } catch (err) {
      if (notify) {
        handleError(err, null, notification)
      }
    }
  }

  const studentMakeEvaluation = async (evaluationId) => {
    try {
      await studentMakeEvaluationService(evaluationId)

      notification.success({
        message: 'Sinh Viên',
        description: 'Đánh giá thành công',
      })

      getEvaluationPrivate(studentId, yearId, semesterId, pointTrainingGroups)
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

  const monitorConfirm = async (isRefuse = false, note) => {
    try {
      const totalPoint = getTotalPoint(monitorEvaluation)

      // monitor make own ticket
      try {
        if (isTicketOfMonitor) {
          await handleClickSaveAsDraft(false)
          await studentMakeEvaluationService(evaluation.id)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('monitor update own ticket')
        await complainService(evaluation.id, '')
      }

      // monitor update student ticket
      try {
        await complainService(evaluation.id, '')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('monitor update student ticket')
      }

      await monitorMakeEvaluationService(
        evaluation.id,
        isRefuse
          ? evaluation.monitorEvaluation
          : JSON.stringify(monitorEvaluation),
        previousResult,
        currentResult,
        totalPoint,
        getClassification(totalPoint),
        isRefuse
          ? JSON.stringify({
              ...getNote(evaluation.note),
              monitorNote: note,
            })
          : '',
      )

      if (!isRefuse) {
        notification.success({
          message: 'Thành công',
        })
      }

      getEvaluationPrivate(studentId, yearId, semesterId, pointTrainingGroups)
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const validateInputPoint = (curr = true, prev = true) => {
    if (currentResult === null && curr) {
      message.error('Vui lòng nhập điểm hệ 4')
      inputCurrentResult.current.focus()
      return false
    }

    if (previousResult === null && prev) {
      message.error('Vui lòng nhập điểm hệ 4')
      inputPreviousResult.current.focus()
      return false
    }

    return true
  }

  const lecturerConfirm = async (isRefuse = false, note) => {
    try {
      const totalPoint = getTotalPoint(monitorEvaluation)
      const classification = getClassification(totalPoint)
      const evaluationString = isRefuse
        ? evaluation.monitorEvaluation
        : JSON.stringify(monitorEvaluation)
      const evaluationId = evaluation.id
      const noteString = isRefuse
        ? JSON.stringify({
            ...getNote(evaluation.note),
            lecturerNote: note,
          })
        : ''

      // update ticket
      try {
        await complainService(evaluation.id, '')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('lecturer update student ticket')
      }

      await lecturerConfirmService(
        evaluationId,
        evaluationString,
        previousResult,
        currentResult,
        totalPoint,
        classification,
        noteString,
      )

      await getEvaluationPrivate(
        studentId,
        yearId,
        semesterId,
        pointTrainingGroups,
      )

      if (!isRefuse) {
        notification.success({
          message: 'Cố vấn học tập xét duyệt',
          description: 'Thành công',
        })
      }
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const employeeConfirm = async (isRefuse = false, note) => {
    try {
      const totalPoint = getTotalPoint(monitorEvaluation)
      const classification = getClassification(totalPoint)
      const evaluationString = isRefuse
        ? evaluation.monitorEvaluation
        : JSON.stringify(monitorEvaluation)
      const evaluationId = evaluation.id
      const noteString = isRefuse
        ? JSON.stringify({
            ...getNote(evaluation.note),
            employeeNote: note,
          })
        : ''
      const employeeId = profile.id

      // update ticket
      try {
        await complainService(evaluation.id, '')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('lecturer update student ticket')
      }

      await employeeConfirmService(
        evaluationId,
        evaluationString,
        previousResult,
        currentResult,
        totalPoint,
        classification,
        noteString,
        employeeId,
      )

      await getEvaluationPrivate(
        studentId,
        yearId,
        semesterId,
        pointTrainingGroups,
      )

      if (!isRefuse) {
        notification.success({
          message: 'Chuyên viên xét duyệt',
          description: 'Thành công',
        })
      }
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleSubmit = async () => {
    if (!validateInputPoint(false, true)) {
      return
    }

    // for student
    if (profile.roleName === ROLE.student) {
      // for monitor
      if (isMonitor) {
        if (!validateInputPoint(true, true)) {
          return
        }

        if (evaluation.status === evaluationStatus.ComplainingMonitor) {
          monitorConfirm(false, 'Đã cập nhật')
        } else {
          monitorConfirm(false)
        }

        return
      }

      // student
      await handleClickSaveAsDraft(false)
      await studentMakeEvaluation(evaluation.id)
      return
    }

    if (!validateInputPoint(true, true)) {
      return
    }

    // for lecturer
    if (viewRole === ROLE.lecturer) {
      await lecturerConfirm(false)
    }

    // for employee
    if (viewRole === ROLE.employee) {
      await employeeConfirm(false)
    }
  }

  const complain = async (value) => {
    if (!value) {
      message.info('Vui lòng nhập nội dung khiếu nại')
      return
    }

    try {
      await complainService(
        evaluation.id,
        JSON.stringify({
          ...getNote(evaluation.note),
          studentNote: value,
        }),
      )

      await getEvaluationPrivate(
        studentId,
        yearId,
        semesterId,
        pointTrainingGroups,
      )
      window.Modal.clear()
      notification.success({ message: 'Gửi khiếu nại thành công' })
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleComplain = () => {
    window.Modal.show(
      <TextAreaForm
        onSubmit={complain}
        placeholder="Nhập nội dung khiếu nại"
        buttonText="KHIẾU NẠI"
      />,
      {
        title: <b>NHẬP NỘI DUNG KHIẾU NẠI</b>,
      },
    )
  }

  const refuseComplain = async (note) => {
    if (!note) {
      message.info('Vui lòng nhập lý do từ chối')
      return
    }

    try {
      if (viewRole === ROLE.monitor) {
        await monitorConfirm(true, note)
      }

      if (viewRole === ROLE.lecturer) {
        await lecturerConfirm(true, note)
      }

      if (viewRole === ROLE.employee) {
        await employeeConfirm(true, note)
      }

      notification.success({
        message: 'Từ chối khiếu nại thành công',
      })
      window.Modal.clear()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleRefuseComplain = async () => {
    window.Modal.show(
      <TextAreaForm
        placeholder="Nhập lý do từ chối"
        onSubmit={refuseComplain}
      />,
      {
        title: <b>TỪ CHỐI KHIẾU NẠI</b>,
      },
    )
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
              readOnly={!isValidDeadline || !isYourTurn}
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
              readOnly={!isValidDeadline || !isYourTurn}
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
        <div style={{ maxWidth: 318 }} className="card me-3 mt-2">
          <div className="card-header">
            <b>MINH CHỨNG</b>
          </div>
          <div className="card-body">
            <Upload
              customRequest={handleAddAttachment}
              onRemove={handleRemoveAttachment}
              fileList={attachments}
              disabled={
                profile.roleName !== ROLE.student ||
                (!isMonitor && !isTicketOfCurrentStudent)
              }
              accept="image/*"
              onPreview={(file) => handleViewImage(file.url)}
            >
              <Button icon={<i className="fas fa-file-upload me-2" />}>
                Tải lên ảnh minh chứng
              </Button>
            </Upload>
          </div>
        </div>
        {isShowNote && (
          <div style={{ maxWidth: 318 }} className="me-3 card mt-2">
            <div className="card-header">
              <b>GHI CHÚ KHIẾU NẠI</b>
            </div>
            <div className="card-body">
              {getNote(evaluation.note).studentNote && (
                <div>
                  <b>Sinh viên:</b> {getNote(evaluation.note).studentNote}
                </div>
              )}

              {getNote(evaluation.note).monitorNote && (
                <div>
                  <b>Lớp trưởng:</b> {getNote(evaluation.note).monitorNote}
                </div>
              )}

              {getNote(evaluation.note).lecturereNote && (
                <div>
                  <b>Cố vấn:</b> {getNote(evaluation.note).lecturereNote}
                </div>
              )}

              {getNote(evaluation.note).employeeNote && (
                <div>
                  <b>Chuyên viên:</b> {getNote(evaluation.note).employeeNote}
                </div>
              )}
            </div>
          </div>
        )}
        {isMonitor && (
          <div style={{ maxWidth: 318 }} className="mt-2 text-end">
            <Upload
              disabled={
                evaluation.status === evaluationStatus.LecturerConfirmed ||
                !isValidDeadline
              }
              showUploadList={false}
              customRequest={({ onSuccess }) => onSuccess()}
              onChange={handleChangeFileEvent}
              fileList={[]}
            >
              <Button
                disabled={
                  evaluation.status === evaluationStatus.LecturerConfirmed ||
                  !isValidDeadline
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
        {isYourTurn && !isValidDeadline && (
          <Alert message="Phiếu đóng vì quá hạn" type="error" />
        )}
      </div>

      <div className="d-flex justify-content-end mt-3">
        {/* on new/draft, is ticket of student */}
        {(evaluation.status === evaluationStatus.New ||
          evaluation.status === evaluationStatus.Draft) &&
          viewRole === ROLE.student &&
          isTicketOfCurrentStudent && (
            <>
              <Button
                disabled={!isValidDeadline}
                onClick={handleClickSaveAsDraft}
                size="large"
                className="me-2"
              >
                LƯU NHÁP
              </Button>
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
            </>
          )}

        {/* on student submited, view by monitor */}
        {evaluation.status === evaluationStatus.StudentSubmited &&
          viewRole === ROLE.monitor && (
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

        {isComplainMe && (
          <Button
            disabled={!isValidDeadline}
            onClick={handleRefuseComplain}
            className="me-2"
            size="large"
          >
            TỪ CHỐI KHIẾU NẠI
          </Button>
        )}

        {(isMySubmited || isComplainMe) && (
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
        )}

        {/* on monitor submited, view by lecturer */}
        {evaluation.status === evaluationStatus.MonitorConfirmed &&
          profile.roleName === ROLE.lecturer && (
            <Popconfirm
              disabled={!isValidDeadline}
              title="DUYỆT đánh giá?"
              onConfirm={handleSubmit}
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

        {/* on student submited and is overdue, view by employee */}
        {evaluation.status === evaluationStatus.StudentSubmited &&
          profile.roleName === ROLE.employee &&
          evaluation.overdue && (
            <Popconfirm
              disabled={!isValidDeadline}
              title="DUYỆT đánh giá?"
              onConfirm={handleSubmit}
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

        {/* on submited by confirmer, view by owner student */}
        {(evaluation.status === evaluationStatus.MonitorConfirmed ||
          evaluation.status === evaluationStatus.LecturerConfirmed ||
          evaluation.status === evaluationStatus.EmployeeConfirmed) &&
          profile.roleName === ROLE.student &&
          !isMonitor &&
          isTicketOfCurrentStudent && (
            <Button onClick={handleComplain} size="large" type="primary">
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
                    {`${evaluationBatch.semester.title}, ${evaluationBatch.year.title}`}
                  </Select.Option>
                ))}
              </Select>
              {!checkIsCurrentActive(yearId, semesterId, evaluationBatches) && (
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
            </>
          )}
        </div>

        {deadlineString && evaluation && evaluation.isInDeadline && (
          <Alert
            message={`Hạn chót của bạn: ${deadlineString} ${
              isYourTurn && !isValidDeadline ? '(quá hạn)' : ''
            }`}
            className="mt-2"
            type={isYourTurn ? (isValidDeadline ? 'success' : 'error') : ''}
          />
        )}

        {evaluation && !evaluation.isInDeadline && (
          <Alert
            message="Ngoài thời gian đánh giá"
            className="mt-2"
            type="error"
          />
        )}
      </div>

      <Divider />

      {evaluation && (
        <Tooltip placement="topLeft" title="Tổng dựa trên lớp đánh giá">
          <div className="tag-total-point">
            <div className="me-2">
              Tổng: <b>{`${getTotalPoint(monitorEvaluation)}đ`}</b> - Xếp loại:{' '}
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
