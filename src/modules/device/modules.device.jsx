import React from 'react'
import Dropdown from '../../components/dropdown/dropdown.component'
export default function Device() {
    const list=[1,2,3,4]
  return (
    <div>
      <Dropdown id={'abc'} list={list} value={""} />
    </div>
  )
}
