import styles from "../CSS/Certification.module.css";

export const Certification = () => {
  return (
    <>
      <section className={styles.certification} id="certification">
        <div className={styles.image}>
          <img
            src="/images/gpp.webp"
            alt="Chứng nhận GPP của nhà thuốc Medicare"
          />
        </div>

        <div className={styles["cer-content"]}>
          <h1>
            <span style={{ color: "#42d673" }}>Medicare</span>{" "}
            <span>Certification</span>
          </h1>
          <p>
            Nhà thuốc chúng tôi tự hào đạt chuẩn GPP . Đây là sự cam kết cao
            nhất về chất lượng và chuyên môn, đảm bảo quý khách hàng luôn nhận
            được thuốc chính hãng, được bảo quản theo tiêu chuẩn nghiêm ngặt.
            Đội ngũ dược sĩ giàu kinh nghiệm của chúng tôi luôn sẵn sàng tư vấn
            tận tâm, giúp quý khách sử dụng thuốc an toàn, hiệu quả, vì lợi ích
            và sức khỏe cộng đồng.
          </p>
        </div>
      </section>
    </>
  );
};
