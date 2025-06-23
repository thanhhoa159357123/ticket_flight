import React from 'react'

const BenefitContent = () => {
  return (
    <div className="p-2.5 bg-[rgb(233, 232, 232)] flex flex-col">
      <span className="text-[15px] font-bold px-2.5">Điều kiện</span>
      <div className="inline-flex flex-col px-2.5 py-5 bg-white">
        <span>VietJet Air</span>
        <span>TP HCM --{'>'} HaNoi * Khuyến mãi</span>
        <ul>
            <li>Không hoàn vé</li>
            <li>Có thể đổi lịch bay</li>
        </ul>
      </div>
    </div>
  )
}

export default BenefitContent
