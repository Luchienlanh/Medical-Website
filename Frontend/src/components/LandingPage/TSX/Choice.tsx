import styles from "../CSS/Choice.module.css";

export const Choice = () => (
  <>
    <section className={styles.choice}>
      <h1>
        <span style={{ color: " #2b9474" }}>Medicare</span>
        <span> - Lựa chọn số một cho sức khỏe gia đình Việt!</span>
      </h1>
    </section>

    <section className={styles.utility}>
      <div className={`${styles.box} ${styles.box1}`}>
        <i className="fa-solid fa-stethoscope"></i>
        <span>Đội ngũ y bác sĩ giàu kinh nghiệm</span>
        <i className="fa-solid fa-capsules"></i>
        <span>Dược phẩm uy tín hàng đầu</span>
      </div>

      <div className={`${styles.box} ${styles.box2}`}>
        <i className="fa-solid fa-truck"></i>
        <span>Giao hàng 24/7</span>
        <i className="fa-solid fa-handshake"></i>
        <span>Đội ngũ hỗ trợ tận tâm</span>
      </div>
    </section>
  </>
);
