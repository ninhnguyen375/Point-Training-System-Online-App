import {Button} from 'antd'
import React from 'react'
import {useHistory} from 'react-router-dom'

const EvaluationList = () => {
  const history = useHistory()

  return (
    <div>
      <Button onClick={() => history.push('/evaluation/confirm', {
        yearId: 1,
        semesterId: 1,
        student: {
          'id': 4,
          'code': '3117410002',
          'fullName': 'Sinh viên D',
          'address': 'Địa chỉ SV D',
          'gender': 1,
          'email': 'Email SV D',
          'roleName': 'Sinh viên',
        },
      })}
      >
        click

      </Button>
    </div>
  )
}

export default EvaluationList
