import React, { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./ChangePass.module.css";

const ChangePassword = () => {
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State cho thông báo lỗi và thành công
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Xử lý khi người dùng nhập liệu
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (error) setError(null);
  };

  // Xử lý khi submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { username, oldPassword, newPassword, confirmPassword } = formData;

    // 1. Kiểm tra điền đầy đủ thông tin
    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    // 2. Kiểm tra mật khẩu mới trùng với xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    // 3. Kiểm tra mật khẩu mới không được trùng mật khẩu cũ (tùy chọn)
    if (newPassword === oldPassword) {
      setError("Mật khẩu mới không được trùng với mật khẩu cũ.");
      return;
    }

    // 4. Giả lập gọi API thành công
    console.log("Dữ liệu gửi đi:", formData);
    setSuccess("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

    // Reset form (tùy chọn)
    setFormData({
      username: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img src="public\images\logo.png" alt="" />
        <h2 className={styles.title}>Đổi Mật Khẩu</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Tên tài khoản */}
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Tên tài khoản
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="Nhập tên tài khoản của bạn"
            />
          </div>

          {/* Mật khẩu cũ */}
          <div className={styles.inputGroup}>
            <label htmlFor="oldPassword" className={styles.label}>
              Mật khẩu cũ
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {/* Mật khẩu mới */}
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.button}>
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
