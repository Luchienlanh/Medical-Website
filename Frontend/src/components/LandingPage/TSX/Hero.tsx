import styles from "../CSS/Hero.module.css";

export const Hero = () => {
  return (
    <section className={styles.hero} id="hero">
      {/* A descriptive alt tag is important for accessibility. 
        I've made an assumption based on the file name. 
      */}
      <img src="/images/anh duoc si.png" alt="Pharmacist providing support" />
      <div className={styles.content}>
        <h1>
          Improving Your Health <br />
          With Medicare
        </h1>
        <p>
          Discover how Medicare can be your trusted partner on your journey
          <br />
          to better health.
        </p>
        <div className={styles.shopping}>
          <a href="/product">Shop Now</a>
          {/* You might want to add a real href to this link */}
          <a href="">Top Product</a>
        </div>
      </div>
    </section>
  );
};
