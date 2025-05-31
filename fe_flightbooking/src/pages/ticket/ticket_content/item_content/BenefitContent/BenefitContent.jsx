import React from 'react'
import styles from "./BenefitContent.module.scss"

const BenefitContent = () => {
  return (
    <div className={styles.benefitContent}>
      <span className={styles.textCondition}>Điều kiện</span>
      <div className={styles.formBenefit}>
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
