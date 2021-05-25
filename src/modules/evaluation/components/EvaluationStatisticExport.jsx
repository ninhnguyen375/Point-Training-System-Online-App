/* eslint-disable new-cap */
import { Button, Switch } from 'antd'
import jsPDF from 'jspdf'
import React, { useCallback, useEffect, useState } from 'react'
import { any, arrayOf, bool, objectOf, string } from 'prop-types'
import logo from '../../../assets/images/sgu-logo.png'
import '../../../assets/fonts/times-normal'
import '../../../assets/fonts/timesi-normal'
import '../../../assets/fonts/timesbd-normal'
import '../../../assets/fonts/timesbi-normal'
import { a4, classification, evaluationStatus } from '../model'
import { getString } from '../../../common/utils/object'
import { configs } from '../../../configs'

// pdfjs
const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' })
pdf.setFont('times')
pdf.setFont('timesi')
pdf.setFont('timesbd')
pdf.setFont('timesbi')

const EvaluationStatisticExport = ({
  evaluations,
  batchTitle,
  isAllStudentClasses,
}) => {
  // state
  const [isFilterValidTicket, setIsFilterValidTicket] = useState(false)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)

  const itemsLength = pages.reduce((prev, curr) => prev + curr.items.length, [])

  // init values
  let course = ''
  let studentClass = ''
  const counter = {}
  // apply
  if (itemsLength > 0) {
    course = getString(evaluations[0], 'student.studentClass.course')
    studentClass = getString(evaluations[0], 'student.studentClass.title')

    for (let i = 0; i < classification.length; i += 1) {
      const item = classification[i]
      counter[item] = evaluations.reduce(
        (prev, curr) => (curr.classification === item ? prev + 1 : prev),
        0,
      )
    }
  }

  const getPages = useCallback(() => {
    const newPages = []
    let src = [...evaluations]
    src = src.map((s, i) => ({ ...s, index: i + 1 }))

    if (isFilterValidTicket) {
      src = src.filter((s) => !!s.conclusionPoint)
    }

    const itemNumWithHeaderAndFooter = 27
    const itemNumWithHeader = 28
    const itemNumWithFooter = 37
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

  const exportToPDF = async () => {
    setLoading(true)
    const input = document.getElementById('pdf-element')

    await pdf.html(input, { html2canvas: { scale: 0.75 } })
    pdf.save(`${batchTitle}.pdf`)

    setLoading(false)
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
          {page.items.map((r) => (
            <tr key={r.index}>
              <td>{r.index}</td>
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
            {isAllStudentClasses ? '' : `(${studentClass})`}
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
          onClick={exportToPDF}
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

      <div id="pdf-element">
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

EvaluationStatisticExport.propTypes = {
  evaluations: arrayOf(objectOf(any)).isRequired,
  batchTitle: string.isRequired,
  isAllStudentClasses: bool,
}

EvaluationStatisticExport.defaultProps = {
  isAllStudentClasses: false,
}

export default EvaluationStatisticExport
