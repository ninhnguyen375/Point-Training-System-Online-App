import { Card } from 'antd'
import { useSelector } from 'react-redux'
import React from 'react'

const Home = () => {
  const store = useSelector((state) => state)
  console.log('~ store', store)

  return (
    <div>
      <Card>alskjf</Card>
    </div>
  )
}

export default Home
