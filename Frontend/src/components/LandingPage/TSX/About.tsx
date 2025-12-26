import styles from "../CSS/About.module.css";

export const About = () => {
  return (
    <>
      <section className={styles.about} id="about">
        <div className={styles.aboutImg}>
          <img src="/images/logo.png" alt="Medicare Logo" />
        </div>

        <div className={styles.aboutPharmaContent}>
          <p>
            Được thành lập từ năm 2005, Medicare đã có gần 20 năm đồng hành cùng
            sức khỏe cộng đồng. Trải qua thời gian dài phát triển, nhà thuốc
            luôn cam kết cung cấp các loại thuốc tân dược, thực phẩm chức năng
            và thiết bị y tế chính hãng, chất lượng.
          </p>
        </div>
      </section>
    </>
  );
};
