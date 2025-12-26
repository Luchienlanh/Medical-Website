import { useEffect, useRef, useState } from "react";
import styles from "../CSS/Feedback.module.css";

export const Feedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  // Số lượng feedback items (không tính duplicate)
  const totalItems = 4;

  // Box width + margin
  const boxWidth = 720; // 700px + 20px margin (10px mỗi bên)

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transform = `translateX(-${
        currentIndex * boxWidth
      }px)`;
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= totalItems - 1) {
        return 0; // Quay về đầu
      }
      return prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return totalItems - 1; // Quay về cuối
      }
      return prev - 1;
    });
  };

  return (
    <>
      <section className={styles["feedback-container"]}>
        <h1>
          <span style={{ color: "#2b9474" }}>Customers</span>{" "}
          <span style={{ color: "gray" }}>Feedback</span>
        </h1>

        <section className={styles["feedback-wrapper"]}>
          <div className={styles.feedback}>
            <div className={styles["feedback-slide"]} ref={slideRef}>
              <div className={`${styles.box} ${styles.fb4}`}>
                <p>
                  "Đây là nhà thuốc lớn, luôn có đầy đủ các loại thuốc từ thông
                  thường đến chuyên khoa mà tôi cần, không phải đi tìm nhiều
                  nơi. Giá cả cũng rất hợp lý, minh bạch. Đặc biệt, cách bố trí
                  quầy kệ gọn gàng giúp tôi dễ dàng tìm kiếm sản phẩm."
                </p>
                <h4>
                  <img src="/images/girl.png" alt="Avatar Chị Yến" />
                  Chị Yến Bủm
                </h4>
              </div>

              <div className={`${styles.box} ${styles.fb1}`}>
                <p>
                  "Dược sĩ ở đây rất chuyên nghiệp và tận tâm. Tôi bị cảm và ho
                  kéo dài, được dược sĩ hỏi kỹ về triệu chứng, tiền sử bệnh và
                  tư vấn rất chi tiết về cách dùng thuốc, liều lượng, và cả
                  những lưu ý trong sinh hoạt. Nhờ sự hướng dẫn kỹ lưỡng mà tôi
                  đã đỡ hơn rất nhiều. Cảm ơn nhà thuốc!"
                </p>
                <h4>
                  <img src="/images/boy.png" alt="Avatar Anh Tin" />
                  Anh Tin Ngo
                </h4>
              </div>

              <div className={`${styles.box} ${styles.fb2}`}>
                <p>
                  "Tôi luôn tin tưởng mua thuốc và thực phẩm chức năng ở đây vì
                  sản phẩm luôn là hàng mới, chính hãng, hạn sử dụng còn rất xa.
                  Tôi rất yên tâm khi sử dụng sản phẩm cho cả gia đình. Nhà
                  thuốc còn cam kết hoàn tiền nếu phát hiện hàng giả, điều này
                  củng cố niềm tin rất lớn."
                </p>
                <h4>
                  <img src="/images/boy.png" alt="Avatar Anh Kiệt" />
                  Anh Kiệt Võ
                </h4>
              </div>

              <div className={`${styles.box} ${styles.fb3}`}>
                <p>
                  "Tôi rất hài lòng với thái độ phục vụ của nhân viên. Dù đông
                  khách nhưng các bạn luôn niềm nở, thân thiện, trò chuyện rất
                  gần gũi. Hơn nữa, nhà thuốc có dịch vụ giao hàng tận nhà rất
                  tiện lợi và nhanh chóng. Một trải nghiệm mua hàng tuyệt vời!"
                </p>
                <h4>
                  <img src="/images/boy.png" alt="Avatar Anh Lực" />
                  Anh Lực 8 tuổi
                </h4>
              </div>
            </div>
          </div>

          <button
            className={`${styles["carousel-btn"]} ${styles["prev-btn"]}`}
            onClick={handlePrev}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button
            className={`${styles["carousel-btn"]} ${styles["next-btn"]}`}
            onClick={handleNext}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </section>
      </section>
    </>
  );
};
