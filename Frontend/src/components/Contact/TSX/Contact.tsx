// Đã thêm 'styles' import trở lại
import styles from "../CSS/Contact.module.css";

export const Contact = () => {
  return (
    <>
      {/* Thay đổi className="section" -> className={styles.section} */}
      <section className={styles.section}>
        {/* Lớp Font Awesome này được giữ nguyên, KHÔNG dùng styles.* */}
        <i className="fa-solid fa-handshake"></i>
        <h1>CONTACT US</h1>
        {/* Thay đổi className="frame" -> className={styles.frame} */}
        <div className={styles.frame}>
          {/* Thay đổi className="input" -> className={styles.input} */}
          <div className={styles.input}>
            {/* Sử dụng dấu ngoặc vuông vì tên class có dấu gạch ngang
              Thay đổi "input-box" -> styles['input-box']
            */}
            <div className={styles["input-box"]}>
              <input type="text" id="your-name" required />
              <label htmlFor="your-name">Your Name</label>
            </div>

            <div className={styles["input-box"]}>
              <input type="email" id="email" required />{" "}
              <label htmlFor="email">Email</label>
            </div>

            <div className={styles["input-box"]}>
              <input type="text" id="message" required />
              <label htmlFor="message">Message</label>
            </div>
          </div>
          <button>Contact us</button>
          {/* Thay đổi "contact-info" -> styles['contact-info'] */}
          <div className={styles["contact-info"]}>
            <h2>Contact</h2>
            <p>example@gmail.com</p>
            <h2>Based in</h2>
            <p>120 Yên Lãng, Đống Đa, Hà Nội</p>
            <img
              src="/images/120yenlang.png"
              alt="Bản đồ hoặc hình ảnh 120 Yên Lãng"
            />
          </div>
        </div>
      </section>
    </>
  );
};
