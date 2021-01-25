import React, { useState } from 'react'
import { Input } from 'antd'

const AddUserItem = props => {
  const { onSearch } = props
  const [id, changeId] = useState('')
  return (
    <li>
      <div display="inline-block">
        <Input.Search
          value={id}
          placeholder="Find users..."
          onChange={e => changeId(e.target.value)}
          onSearch={() => onSearch(id)}
        />
      </div>
    </li>
  )
}

export default AddUserItem
