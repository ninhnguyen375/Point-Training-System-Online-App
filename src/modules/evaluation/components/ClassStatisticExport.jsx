/* eslint-disable new-cap */
import { Button, notification, Switch } from 'antd'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { any, arrayOf, objectOf, string } from 'prop-types'
import logo from '../../../assets/images/sgu-logo.png'
import '../../../assets/fonts/times-normal'
import '../../../assets/fonts/timesi-normal'
import '../../../assets/fonts/timesbd-normal'
import '../../../assets/fonts/timesbi-normal'
import { a4, classification, evaluationStatus } from '../model'
import { getString } from '../../../common/utils/object'
import { configs } from '../../../configs'
import { signPDFAsync } from '../services'
import handleError from '../../../common/utils/handleError'

// pdfjs
const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' })
pdf.setFont('times')
pdf.setFont('timesi')
pdf.setFont('timesbd')
pdf.setFont('timesbi')

const ClassStatisticExport = ({ evaluations, batchTitle }) => {
  // state
  const [isFilterValidTicket, setIsFilterValidTicket] = useState(false)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)

  // ref
  const pdfElement = useRef(null)

  const itemsLength = pages.reduce((prev, curr) => prev + curr.items.length, [])

  // init values
  let course = ''
  let studentClass = ''
  let overdue = false
  const counter = {}
  let signatures = []
  let employee
  let monitor
  let lecturer
  let deputyDean
  // apply
  if (itemsLength > 0) {
    overdue = evaluations[0].overdue
    // counter
    for (let i = 0; i < classification.length; i += 1) {
      const item = classification[i]
      counter[item] = evaluations.reduce(
        (prev, curr) => (curr.classification === item ? prev + 1 : prev),
        0,
      )
    }

    for (let i = 0; i < evaluations.length; i += 1) {
      const item = evaluations[i]

      if (getString(item, 'student.studentClass.course')) {
        course = getString(item, 'student.studentClass.course')
      }
      if (getString(item, 'student.studentClass.title')) {
        studentClass = getString(item, 'student.studentClass.title')
      }
      if (item.employee) {
        employee = item.employee
      }
      if (item.monitor) {
        monitor = item.monitor
      }
      if (item.lecturer) {
        lecturer = item.lecturer
      }
      if (item.deputyDean) {
        deputyDean = item.deputyDean
      }
    }

    if (overdue) {
      signatures[0] = employee
        ? {
            roleTag: 'CHUYÊN VIÊN ĐÁNH GIÁ',
            fullName: employee.fullName,
            code: employee.code,
            email: employee.email,
          }
        : null
      signatures[1] = deputyDean
        ? {
            roleTag: 'TRƯỞNG KHOA/NGÀNH',
            fullName: deputyDean.fullName,
            code: deputyDean.code,
            email: deputyDean.email,
          }
        : null
    } else {
      signatures[0] = monitor
        ? {
            roleTag: 'LỚP TRƯỞNG',
            fullName: monitor.fullName,
            code: monitor.code,
            email: monitor.email,
          }
        : null
      signatures[1] = lecturer
        ? {
            roleTag: 'CỐ VẤN HỌC TẬP',
            fullName: lecturer.fullName,
            code: lecturer.code,
            email: lecturer.email,
          }
        : null
      signatures[2] = deputyDean
        ? {
            roleTag: 'TRƯỞNG KHOA/NGÀNH',
            fullName: deputyDean.fullName,
            code: deputyDean.code,
            email: deputyDean.email,
          }
        : null
    }

    signatures = signatures.filter((s) => s !== null)
  }

  const getPages = useCallback(() => {
    const newPages = []
    let src = [...evaluations]
    src = src.map((s, i) => ({ ...s, index: i + 1 }))

    if (isFilterValidTicket) {
      src = src.filter((s) => !!s.conclusionPoint)
    }

    const itemNumWithHeaderAndFooter = 22
    const itemNumWithHeader = 28
    const itemNumWithFooter = 32
    const itemNum = 37
    let numPage = 1
    let isSplitFooter = true

    // init page 1
    if (src.length <= itemNumWithHeaderAndFooter) {
      isSplitFooter = false
      newPages.push({
        numPage,
        items: src.splice(0),
      })
    } else {
      newPages.push({
        numPage,
        items: src.splice(
          0,
          src.length >= itemNumWithHeader ? itemNumWithHeader : src.length,
        ),
      })
    }

    // apply newPages
    while (src.length > 0) {
      numPage += 1

      if (src.length <= itemNumWithFooter) {
        isSplitFooter = false
        newPages.push({
          numPage,
          items: src.splice(0),
        })
      } else {
        newPages.push({
          numPage,
          items: src.splice(0, src.length >= itemNum ? itemNum : src.length),
        })
      }
    }
    if (isSplitFooter) {
      newPages.push({
        numPage: numPage + 1,
        items: [],
      })
    }

    setPages(newPages)
  }, [isFilterValidTicket, evaluations])

  useEffect(() => {
    getPages()
  }, [getPages])

  const exportToPDF = async (pdfE) => {
    setLoading(true)
    const input = document.getElementById('pdf-element')

    const signSlots = document.getElementsByClassName('signSlot')
    const rect = pdfE.current.getBoundingClientRect()
    const slots = []
    for (let i = 0; i < signSlots.length; i += 1) {
      const element = signSlots[i].getBoundingClientRect()
      const user = signatures[i]
      slots.push({
        fullName: user.fullName,
        email: user.email,
        code: user.code,
        x: parseInt(element.x, 10) - parseInt(rect.x, 10),
        y:
          parseInt(element.y, 10) -
          parseInt(rect.y, 10) -
          parseInt(element.height, 10),
        width: parseInt(element.width, 10),
        height: parseInt(element.height, 10) * 2,
      })
    }

    await pdf.html(input, { html2canvas: { scale: 0.75 } })
    const arraybuffer = pdf.output('arraybuffer')

    let binary = ''
    const bytes = new Uint8Array(arraybuffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i])
    }
    const base64 = btoa(binary)

    try {
      let { data } = await signPDFAsync({
        base64,
        slots,
      })

      data = data.data.signed

      data = new Blob([Buffer.from(data, 'base64')], {
        type: 'application/pdf',
      })
      FileSaver.saveAs(data, `Bảng điểm rèn luyện ${batchTitle}.pdf`)
    } catch (err) {
      handleError(err, null, notification)
    }

    setLoading(false)
    window.location.reload()
  }

  const renderTable = (page) => {
    if (page.items.length === 0) {
      return ''
    }
    return (
      <table className="raw-table mt-2">
        <thead>
          <tr>
            <th>
              <b>STT</b>
            </th>
            <th>
              <b>Mã sinh viên</b>
            </th>
            <th>
              <b>Họ và tên SV</b>
            </th>
            <th>
              <b>Ngày sinh</b>
            </th>
            <th>
              <b>Điểm</b>
            </th>
            <th>
              <b>Ghi chú</b>
            </th>
          </tr>
        </thead>
        <tbody>
          {page.items.map((r, index) => (
            <tr key={r.index}>
              <td>{index + 1}</td>
              <td>{getString(r, 'student.code')}</td>
              <td>
                <div className="d-flex justify-content-between pe-1 ps-1">
                  <span>
                    {getString(r, 'student.fullName')
                      .split(' ')
                      .slice(
                        0,
                        getString(r, 'student.fullName').split(' ').length - 1,
                      )
                      .join(' ')}
                  </span>
                  <span>
                    {
                      getString(r, 'student.fullName').split(' ')[
                        getString(r, 'student.fullName').split(' ').length - 1
                      ]
                    }
                  </span>
                </div>
              </td>
              <td>{getString(r, 'student.dateOfBirth')}</td>
              <td>{r.conclusionPoint}</td>
              <td>
                {r.status === evaluationStatus.Canceled
                  ? r.reasonForCancellation
                  : r.classification}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const renderFooter = () => (
    <div>
      <div>
        Tổng cộng danh sách này có {itemsLength} sinh viên được đánh giá rèn
        luyện
      </div>

      <div className="d-flex justify-content-between mt-3">
        {signatures.map((s) => (
          <div key={s.roleTag} className="text-center">
            <div>
              <b>{s.roleTag}</b>
            </div>
            <div className="mt-2 mb-2">
              <i className="signSlot">Đã ký điện tử</i>
            </div>
            <div>{s.fullName}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderHeader = () => (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <div className="me-4">
            <img id="logo" src={logo} width={50} alt="img" />
          </div>
          <div className="text-center">
            <div>Trường Đại Học Sài Gòn</div>
            <div>Phòng Công Tác Sinh Viên</div>
            <div> -o0o- </div>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-end">
            {classification.slice(0, 3).map((c) => (
              <div className="me-2" key={c}>
                {c}: {counter[c]}
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end">
            {classification.slice(3, 6).map((c) => (
              <div className="me-2" key={c}>
                {c}: {counter[c]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <div>
          <b>Bảng Ghi Điểm Rèn Luyện</b>
        </div>
        <div>{batchTitle}</div>
      </div>

      <div className="mt-2">
        <div>
          <b>
            Lớp: Đại học chính quy - ngành {configs.Speciality} - Khóa {course}{' '}
            {`(${studentClass})`}
          </b>
        </div>
        <div>
          <b>
            Khoa: {configs.Speciality} - {configs.Speciality}
          </b>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div
        className="d-flex align-items-center mb-2 flex-wrap"
        style={{ width: a4.width }}
      >
        <Button
          disabled={loading}
          loading={loading}
          onClick={() => exportToPDF(pdfElement)}
          type="primary"
          className="me-2"
        >
          {!loading && <i className="fas fa-download me-2" />}
          TẢI XUỐNG
        </Button>
        <div className="d-flex align-items-center">
          <Switch
            onChange={(checked) => setIsFilterValidTicket(checked)}
            checked={isFilterValidTicket}
            className="me-2"
          />
          CHỈ LẤY SINH VIÊN CÓ ĐIỂM
        </div>
      </div>

      <div ref={pdfElement} id="pdf-element">
        {itemsLength > 0 ? (
          pages.map((p) => (
            <div
              key={p.numPage}
              style={{
                width: a4.width,
                height: a4.height,
                padding: a4.padding,
                fontSize: a4.fontSize,
                border: '1px solid lightgray',
              }}
            >
              <div>
                {p.numPage === 1 && renderHeader()}

                {renderTable(p)}

                {p.numPage === pages.length && renderFooter()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <i>Rỗng</i>
          </div>
        )}
      </div>
    </div>
  )
}

ClassStatisticExport.propTypes = {
  evaluations: arrayOf(objectOf(any)).isRequired,
  batchTitle: string.isRequired,
}

export default ClassStatisticExport
