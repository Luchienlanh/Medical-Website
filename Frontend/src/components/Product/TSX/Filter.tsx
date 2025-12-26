import React from "react";
import styles from "../CSS/Filter.module.css";
import { useSearchParams } from "react-router";
export const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleMultiSelect = (key: string, value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      const currentValues = newParams.getAll(key);

      if (currentValues.includes(value)) {
        newParams.delete(key);
        currentValues
          .filter((item) => item !== value)
          .forEach((item) => newParams.append(key, item));
      } else {
        newParams.append(key, value);
      }

      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePriceSelect = (min: string, max: string, isChecked: boolean) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (isChecked) {
        newParams.set("minPrice", min);
        if (max !== "Infinity") {
          newParams.set("maxPrice", max);
        } else {
          newParams.delete("maxPrice"); // Trường hợp > 500k
        }
      } else {
        newParams.delete("minPrice");
        newParams.delete("maxPrice");
      }

      newParams.set("page", "1");
      return newParams;
    });
  };

  const isChecked = (key: string, value: string) => {
    return searchParams.getAll(key).includes(value);
  };

  const isPriceChecked = (min: string) => {
    return searchParams.get("minPrice") === min;
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <h3>BỘ LỌC</h3>

        <div className={styles["filter-group"]}>
          <h3>Lọc theo giá</h3>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handlePriceSelect("0", "100000", e.target.checked)
                  }
                  checked={
                    isPriceChecked("0") &&
                    searchParams.get("maxPrice") === "100000"
                  }
                />{" "}
                Dưới 100.000đ
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handlePriceSelect("100000", "300000", e.target.checked)
                  }
                  checked={isPriceChecked("100000")}
                />{" "}
                100.000đ - 300.000đ
              </label>
            </li>

            <li>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handlePriceSelect("500000", "Infinity", e.target.checked)
                  }
                  checked={isPriceChecked("500000")}
                />{" "}
                Trên 500.000đ
              </label>
            </li>
          </ul>
        </div>

        <div className={styles["filter-group"]}>
          <h3>Thương hiệu</h3>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked("brand", "duoc_hau_giang")}
                  onChange={() => handleMultiSelect("brand", "duoc_hau_giang")}
                />
                Dược Hậu Giang
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked("brand", "traphaco")}
                  onChange={() => handleMultiSelect("brand", "traphaco")}
                />
                Traphaco
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked("brand", "blackmores")}
                  onChange={() => handleMultiSelect("brand", "blackmores")}
                />
                Blackmores
              </label>
            </li>
          </ul>
        </div>

        {/* --- GROUP: QUỐC GIA --- */}
        <div className={styles["filter-group"]}>
          <h3>Nước sản xuất</h3>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked("country", "vietnam")}
                  onChange={() => handleMultiSelect("country", "vietnam")}
                />{" "}
                Việt Nam
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked("country", "usa")}
                  onChange={() => handleMultiSelect("country", "usa")}
                />{" "}
                Mỹ
              </label>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
