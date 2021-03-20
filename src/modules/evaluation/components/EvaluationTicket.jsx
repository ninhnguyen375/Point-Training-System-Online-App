import {
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
  Tag,
  Tooltip,
  Upload,
} from 'antd'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import moment from 'moment'
import readExcelFile from 'read-excel-file'
import PropTypes from 'prop-types'
import handleError from '../../../common/utils/handleError'
import {
  getEvaluationPrivateService,
  getPointOnlineService,
  getPointTrainingGroupsService,
  getYearsService,
  uploadFileService,
  removeFileService,
  studentMakeDraftEvaluationService,
  studentMakeEvaluationService,
  monitorMakeEvaluationService,
  lecturerApproveService,
} from '../services'
import {MODULE_NAME as MODULE_USER, ROLE} from '../../user/model'
import {disableEvaluationItems, evaluationStatus, semesters} from '../model'
import {cloneObj} from '../../../common/utils/object'
import {configs} from '../../../configs'

const EvaluationTicket = ({student, yearIdProp, semesterIdProp}) => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [studentEvaluation, setStudentEvaluation] = useState(null)
  const [monitorEvaluation, setMonitorEvaluation] = useState(null)
  const [displayEvaluationTicket, setDisplayEvaluationTicket] = useState([])
  const [currentResult, setCurrentResult] = useState(null)
  const [previousResult, setPreviousResult] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [years, setYears] = useState([])
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [pointOfEvent, setPointOfEvent] = useState([])
  const [pointOfEventError, setPointOfEventError] = useState([])
  // ref
  const inputCurrentResult = useRef(null)
  const inputPreviousResult = useRef(null)

  const {isMonitor} = profile
  const isTicketOfMonitor =
    isMonitor && evaluation && evaluation.monitorId === profile.id

  useEffect(() => {
    setYearId(yearIdProp)
    setSemesterId(semesterIdProp)
  }, [yearIdProp, semesterIdProp])

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

    return {isValid, k}
  }

  const getEvaluationWithNewPoint = (id, point, clone) => {
    const newEvaluationTicket = clone.map((group) => {
      if (group.id === id) {
        return {...group, point}
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
      const {errors} = reader
      let {rows} = reader

      rows = rows.map((r, i) => ({...r, row: i + 2}))

      const pointForStudent = rows.find(
        (r) => String(r.code) === String(student.code || profile.code),
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

  const handleChangeFile = (info) => {
    const fileList = [...info.fileList]

    setAttachments(fileList)
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
          displayEvalutionTicket.push({...item, class: 'fw-bold'})

          if (item.childrenItemList) {
            item.childrenItemList.forEach((child) => {
              evaluationDataItem.push({
                id: child.id,
                title: child.title,
                parentId: d.id,
                point: 0,
              })
              displayEvalutionTicket.push({...child, class: 'ms-3'})
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
        JSON.parse(evaluationPrivate.monitorEvaluation) || mapped.evaluationData,
      )
      setStudentEvaluation(
        JSON.parse(evaluationPrivate.studentEvaluation) || mapped.evaluationData,
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

  useEffect(() => {
    if (yearId && semesterId) {
      getEvaluationPrivate(yearId, semesterId)
    }
  }, [getEvaluationPrivate, yearId, semesterId])

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
        evaluation.status === evaluationStatus.AcceptEvaluationStatus
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

  const handleGetPointOnline = async () => {
    setLoading(true)

    const code = student.code || profile.code
    try {
      const {data} = await getPointOnlineService(code)
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

    setLoading(false)
  }

  const handleRemoveAttachment = async (file) => {
    try {
      const {data} = await removeFileService(
        evaluation.id,
        file.url.split('/')[file.url.split('/').length - 1],
      )

      const newAtts = attachments.filter((a) => a.name !== file.name)
      setAttachments(newAtts)
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleAddAttachment = async ({onSuccess, file}) => {
    try {
      const {data} = await uploadFileService(evaluation.id, file)

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

  const handleClickSaveAsDraft = async () => {
    try {
      await studentMakeDraftEvaluationService(
        evaluation.id,
        JSON.stringify(studentEvaluation),
        previousResult,
        currentResult,
      )
      await getEvaluationPrivate(yearId, semesterId)
      notification.success({message: 'Lưu nháp thành công'})
    } catch (err) {
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
      await getEvaluationPrivate(yearId, semesterId)
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const monitorMakeEvaluation = async () => {
    try {
      await monitorMakeEvaluationService(
        evaluation.id,
        JSON.stringify(monitorEvaluation),
        previousResult,
        currentResult,
      )
      notification.success({
        message: 'Lớp trưởng đánh giá thành công',
      })
      await getEvaluationPrivate(yearId, semesterId)
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleSubmit = () => {
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

        monitorMakeEvaluation()
        return
      }

      // not monitor
      // validate
      if (previousResult === null) {
        message.error('Vui lòng nhập điểm hệ 4')
        inputPreviousResult.current.focus()
        return
      }
      studentMakeEvaluation(evaluation.id)
    }
  }

  const handleLecturerApprove = async () => {
    try {
      await lecturerApproveService(evaluation.id)
      await getEvaluationPrivate(yearId, semesterId)
      notification.success({
        message: 'Cố vấn học tập xét duyệt',
        description: 'Thành công',
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
          {student.fullName || profile.fullName || 'sv'}
        </div>
        <div className="mt-2">
          <b>MSSV: </b>
          {student.code || profile.code || 'sv'}
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
            />
            <span className="me-2 ms-2">xem trên</span>
            <a
              target="blank"
              href={`http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${
                student.code || profile.code
              }`}
            >
              <b>thongtindaotao</b>
              <i className="fas fa-external-link-alt ms-2" />
            </a>
          </div>
        </div>
        <div className="mt-2">
          <b>
            Nhập điểm hệ 4 học kỳ hiện tại
            {' '}
            {isMonitor ? '' : '(bỏ trống nếu chưa có)'}
            :
          </b>
          <div className="mt-2 d-flex flex-wrap align-items-center">
            <InputNumber
              ref={inputCurrentResult}
              min={0}
              max={4}
              onChange={(v) => setCurrentResult(v)}
              value={currentResult}
            />
            <span className="me-2 ms-2">xem trên</span>
            <a
              target="blank"
              href={`http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${
                student.code || profile.code
              }`}
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
        scroll={{x: '600px'}}
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
        <div style={{maxWidth: 318}} className="card p-3 me-3 mt-2">
          <Upload
            customRequest={handleAddAttachment}
            onRemove={handleRemoveAttachment}
            fileList={attachments}
          >
            <Button icon={<i className="fas fa-file-upload me-2" />}>
              Tải lên ảnh minh chứng
            </Button>
          </Upload>
        </div>
        <div style={{maxWidth: 318}} className="me-3 card p-3 mt-2">
          <div>Nội dung khiếu nại:</div>
          <Input.TextArea style={{width: 284}} placeholder="Nhập khiếu nại" />
        </div>
        {isMonitor && (
          <div style={{maxWidth: 318}} className="mt-2 text-end">
            <Upload
              disabled={
                evaluation.status === evaluationStatus.AcceptEvaluationStatus
              }
              showUploadList={false}
              customRequest={({onSuccess}) => onSuccess()}
              onChange={handleChangeFileEvent}
              fileList={[]}
            >
              <Button
                disabled={
                  evaluation.status === evaluationStatus.AcceptEvaluationStatus
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
        {!isMonitor && !isTicketOfMonitor && profile.roleName === ROLE.student && (
          <div className="alert alert-info m-0">
            {evaluation.status === evaluationStatus.NewEvaluationStatus &&
              'Bạn có thể lưu nháp hoặc chọn HOÀN TẤT để lớp trưởng đánh giá.'}
            {evaluation.status === evaluationStatus.DraftEvaluationStatus &&
              !isMonitor &&
              !isTicketOfMonitor &&
              'Phiếu hiện tại đang là nháp, chọn HOÀN TẤT để lớp trưởng đánh giá.'}
            {evaluation.status === evaluationStatus.SubmitEvaluationStatus &&
              !isMonitor &&
              !isTicketOfMonitor &&
              'Bạn đã hoàn tất phiếu đánh giá, phiếu đang chờ lớp trưởng đánh giá, bạn có thể chỉnh sửa trong khoản thời gian này.'}
            {evaluation.status === evaluationStatus.ConfirmEvaluationStatus &&
              !isMonitor &&
              !isTicketOfMonitor &&
              'Lớp trưởng đã đánh giá phiếu của bạn, bạn có thể khiếu nại nếu thấy sai sót.'}
          </div>
        )}
      </div>
      <div className="d-flex justify-content-end mt-3">
        {(evaluation.status === evaluationStatus.NewEvaluationStatus ||
          evaluation.status === evaluationStatus.DraftEvaluationStatus ||
          evaluation.status === evaluationStatus.SubmitEvaluationStatus) && (
          <>
            {isMonitor && !isTicketOfMonitor ? (
              ''
            ) : (
              <Button
                onClick={handleClickSaveAsDraft}
                size="large"
                className="me-2"
              >
                LƯU NHÁP
              </Button>
            )}
            <Popconfirm title="HOÀN TẤT đánh giá?" onConfirm={handleSubmit}>
              <Button className="success" size="large" type="primary">
                HOÀN TẤT
              </Button>
            </Popconfirm>
          </>
        )}

        {evaluation.status === evaluationStatus.ConfirmEvaluationStatus &&
          isMonitor && (
          <Popconfirm title="CẬP NHẬT đánh giá?" onConfirm={handleSubmit}>
            <Button className="success" size="large" type="primary">
              CẬP NHẬT
            </Button>
          </Popconfirm>
        )}

        {evaluation.status === evaluationStatus.ConfirmEvaluationStatus &&
          profile.roleName === ROLE.lecturer && (
          <Popconfirm
            title="DUYỆT đánh giá?"
            onConfirm={handleLecturerApprove}
          >
            <Button className="success" size="large" type="primary">
              DUYỆT ĐÁNH GIÁ
            </Button>
          </Popconfirm>
        )}

        {evaluation.status === evaluationStatus.ConfirmEvaluationStatus &&
          profile.roleName === ROLE.student &&
          !isMonitor && (
          <Button
            onClick={() => message.info('khieu nai')}
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
          <b>TỰ ĐÁNH GIÁ RÈN LUYỆN </b>
          -
          {' '}
          {isMonitor ? 'Lớp trưởng' : 'Sinh viên'}
          {' '}
          thực hiện đánh giá đến hết
          ngày
          <b className="ms-2 text-danger">
            {evaluation &&
              (isMonitor
                ? evaluation.DeadlineDateForMonitor
                : evaluation.DeadlineDateForStudent)}
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
            style={{width: '100%'}}
            value={yearId}
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
            style={{width: '100%'}}
            value={semesterId}
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

      {evaluation && (
        <Tooltip placement="topLeft" title="Tổng dựa trên lớp trưởng đánh giá">
          <div className="tag-total-point">
            <div className="me-2">
              Tổng:
              {' '}
              <b>{getTotalPoint(monitorEvaluation)}</b>
              đ - Xếp loại:
              {' '}
              <b>Khá</b>
            </div>
            <Tag color="geekblue">
              <b>{evaluation.status.toUpperCase()}</b>
            </Tag>
          </div>
        </Tooltip>
      )}

      {evaluation && renderTicket(columns, displayEvaluationTicket)}
    </Card>
  )
}

EvaluationTicket.propTypes = {
  student: PropTypes.objectOf(PropTypes.any),
  yearIdProp: PropTypes.number,
  semesterIdProp: PropTypes.number,
}

EvaluationTicket.defaultProps = {
  student: {},
  yearIdProp: null,
  semesterIdProp: null,
}

export default EvaluationTicket
