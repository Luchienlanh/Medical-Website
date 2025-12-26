import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/?format=json";

// Export interface để File hiển thị có thể dùng lại
export interface ApiData {
  id: number;
  productName: string;
  cost: number;
  status: boolean;
  img: string;
  productDesc: string;
  quantity?: number;
}

export const useProductFetcher = () => {
  const [data, setData] = useState<ApiData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Đang gọi API:", API_URL);
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${
              errorText || response.statusText
            }`
          );
        }

        const result = await response.json();
        console.log("API Response:", result);

        // --- XỬ LÝ DỮ LIỆU ĐỂ LẤY MẢNG CHUẨN ---
        let finalData: ApiData[] = [];

        if (Array.isArray(result)) {
          finalData = result;
        } else if (result.results && Array.isArray(result.results)) {
          finalData = result.results;
        } else if (result.data && Array.isArray(result.data)) {
          finalData = result.data;
        } else {
          finalData = [result];
        }

        // --- CẬP NHẬT STATE VÀ LƯU LOCAL STORAGE ---
        setData(finalData);

        // Lưu mảng chuẩn xuống Local Storage
        try {
          localStorage.setItem("products", JSON.stringify(finalData));
          console.log("Đã lưu data xuống LocalStorage");
        } catch (storageErr) {
          console.warn("Lỗi lưu storage (có thể do quota):", storageErr);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
        if (e instanceof TypeError && e.message.includes("fetch")) {
          setError("Không thể kết nối API. Kiểm tra Server Django và CORS.");
        } else if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Trả về dữ liệu để File giao diện sử dụng
  return { data, loading, error };
};
