import React from 'react';
import styles from './feature.module.scss';
import PlaneImg from '../../assets/bg_feature.jpg';

const Feature = () => {
  return (
    <section className={styles.feature}>
      <div className={styles.contentContainer}>
        <h1 className={styles.headline}>
          <span className={styles.highlight}>Create Ever-lasting</span>
          <br />
          <span className={styles.highlight}>Memories With Us</span>
        </h1>
        <p className={styles.subheadline}>Discover the world with our premium flight experiences</p>
        
        <div className={styles.imageWrapper}>
          <img src={PlaneImg} alt="Airplane in flight" className={styles.plane} />
          <div className={styles.imageOverlay}></div>
        </div>
      </div>
    </section>
  );
};

export default Feature;