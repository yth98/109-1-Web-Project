import React from 'react'
import { Input } from 'antd'

const AddUserItem = props => {
  const [id, changeId] = props.Value
  return (
    <li>
      <div display="inline-block">
        <Input.Search
          value={id}
          placeholder="findID"
          onChange={e => changeId(e.target.value)}
        />
      </div>
    </li>
  )
}

export default AddUserItem
