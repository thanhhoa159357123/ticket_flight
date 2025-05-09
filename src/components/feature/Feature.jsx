import React from 'react'
import './feature.scss'
import PlaneImg from '../../assets/bg_feature.jpg' // Đường dẫn tới ảnh máy bay bạn đã tải

const Feature = () => {
  return (
    <div className="feature">
      <h1 className="headline">Create Ever-lasting<br />Memories With Us</h1>
      <div className="image-wrapper">
        <img src={PlaneImg} alt="Airplane" className="plane" />
      </div>
    </div>
  )
}

export default Feature
