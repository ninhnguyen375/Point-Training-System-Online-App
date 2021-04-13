/* eslint-disable new-cap */
import { Button } from 'antd'
import jsPDF from 'jspdf'
import React, { useCallback, useEffect, useState } from 'react'
import { any, arrayOf, objectOf, string } from 'prop-types'
import '../../../assets/fonts/times-normal'
import '../../../assets/fonts/timesi-normal'
import '../../../assets/fonts/timesbd-normal'
import '../../../assets/fonts/timesbi-normal'
import { a4, classification } from '../model'
import { configs } from '../../../configs'

// pdfjs
const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' })
pdf.setFont('times')
pdf.setFont('timesi')
pdf.setFont('timesbd')
pdf.setFont('timesbi')

const CounterStatisticExport = ({ studentClassCounters, batchTitle }) => {
  // state
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)

  const itemsLength = pages.reduce((prev, curr) => prev + curr.items.length, [])

  const getPages = useCallback(() => {
    const newPages = []
    let src = [...studentClassCounters]
    src = src.map((s, i) => ({ ...s, index: i + 1 }))

    const itemNumWithHeaderAndFooter = 36
    const itemNumWithHeader = 36
    const itemNumWithFooter = 36
    const itemNum = 36
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
  }, [studentClassCounters])

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
            <th rowSpan={2}>
              <b>STT</b>
            </th>
            <th rowSpan={2}>
              <b>LỚP</b>
            </th>
            <th rowSpan={2}>
              <b>SĨ SỐ</b>
            </th>
            <th colSpan={7}>
              <b>XẾP LOẠI RÈN LUYỆN</b>
            </th>
          </tr>
          <tr>
            <th>
              <b>XS</b>
            </th>
            <th>
              <b>Tốt</b>
            </th>
            <th>
              <b>Khá</b>
            </th>
            <th>
              <b>TB</b>
            </th>
            <th>
              <b>Yếu</b>
            </th>
            <th>
              <b>Kém</b>
            </th>
            <th>
              <b>Lý do</b>
            </th>
          </tr>
        </thead>
        <tbody>
          {page.items.map((r) => (
            <tr key={r.index}>
              <td>{r.index}</td>
              <td>{r.title}</td>
              <td>{r.studentNumber}</td>
              <td>{r[classification[0]]}</td>
              <td>{r[classification[1]]}</td>
              <td>{r[classification[2]]}</td>
              <td>{r[classification[3]]}</td>
              <td>{r[classification[4]]}</td>
              <td>{r[classification[5]]}</td>
              <td>{r.canceled}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

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
                {batchTitle} - {configs.Speciality}
              </div>
              <div>{renderTable(p)}</div>
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

CounterStatisticExport.propTypes = {
  studentClassCounters: arrayOf(objectOf(any)).isRequired,
  batchTitle: string.isRequired,
}

export default CounterStatisticExport
