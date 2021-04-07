import { Button, Divider, Radio, Tag } from 'antd'
import { func } from 'prop-types'
import React, { useState } from 'react'
import { reasonForCancellation } from '../model'

const SelectReasonCancellationForm = ({ onSubmit }) => {
  const [reasonForCancellationInput, setReasonForCancellationInput] = useState(
    '',
  )
  return (
    <div>
      <Radio.Group
        onChange={(e) => setReasonForCancellationInput(e.target.value)}
        value={reasonForCancellationInput}
      >
        {reasonForCancellation.map((r) => (
          <Radio className="mt-2" key={r} value={r}>
            <Tag>{r}</Tag>
          </Radio>
        ))}
      </Radio.Group>

      <Divider />
      <div className="d-flex justify-content-end">
        <Button
          type="primary"
          danger
          onClick={() => onSubmit(reasonForCancellationInput)}
        >
          HỦY PHIẾU
        </Button>
      </div>
    </div>
  )
}

SelectReasonCancellationForm.propTypes = {
  onSubmit: func.isRequired,
}

export default SelectReasonCancellationForm
