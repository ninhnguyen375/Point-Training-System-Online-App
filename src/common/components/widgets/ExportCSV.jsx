import React from 'react'
import { Button } from 'antd'
import * as XLSX from 'xlsx'
import PropTypes from 'prop-types'

const ExportCSV = ({
  jsonData,
  fileName,
  children,
  useButton,
  style,
  ...props
}) => {
  const fileExtension = '.xlsx'

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(jsonData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    XLSX.writeFile(wb, fileName + fileExtension)
  }

  if (useButton) {
    return (
      <Button onClick={exportToCSV} {...props}>
        {children}
      </Button>
    )
  }

  return (
    <div onClick={exportToCSV} aria-hidden="true">
      {children}
    </div>
  )
}
ExportCSV.propTypes = {
  jsonData: PropTypes.arrayOf(PropTypes.any).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  fileName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  useButton: PropTypes.bool,
}

ExportCSV.defaultProps = {
  style: {},
  useButton: true,
}
export default ExportCSV
