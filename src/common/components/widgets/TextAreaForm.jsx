import { Button, Divider, Input } from 'antd'
import { func, string } from 'prop-types'
import React, { useState } from 'react'

const TextAreaForm = ({ onSubmit, placeholder, buttonText }) => {
  const [value, setValue] = useState('')

  return (
    <div className="container-fluid">
      <Input.TextArea
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        allowClear
      />

      <Divider />
      <div className="d-flex justify-content-end">
        <Button type="primary" onClick={() => onSubmit(value)}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

TextAreaForm.propTypes = {
  onSubmit: func.isRequired,
  placeholder: string,
  buttonText: string,
}

TextAreaForm.defaultProps = {
  placeholder: '',
  buttonText: 'HOÀN TẤT',
}

export default TextAreaForm
