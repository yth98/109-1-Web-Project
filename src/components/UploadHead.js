import React from 'react'
import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import instance from '../axios'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload(file) {
  const isAllowedType = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'].indexOf(file.type) !== -1
  if (!isAllowedType) {
    message.error('You can only upload JPG/PNG/WEBP/TIFF file!')
  }
  const isLtEq2M = file.size <= 2 * 1024 * 1024
  if (!isLtEq2M) {
    message.error('Image size must be no more than 2MB!')
  }
  return isAllowedType && isLtEq2M
}

export default class UploadHead extends React.Component {
  state = {
    loading: false,
  }

  handleChange = info => {
    switch (info.file.status) {
      case 'uploading':
        this.setState({ loading: true })
        return
      case 'done':
        if (info.file.response.success)
          this.props.setAvatar(info.file.response.token)
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({ imageUrl, loading: false, })
        )
        return
      case 'error':
      default:
        this.setState({ imageUrl: null, loading: false, })
    }
  }

  render() {
    const { loading, imageUrl } = this.state
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={`${instance.defaults.baseURL}/avatar`}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : uploadButton}
      </Upload>
    )
  }
}
