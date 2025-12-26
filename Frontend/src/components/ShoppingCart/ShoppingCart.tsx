import styles from "./ShoppingCart.module.css";
import { useContext, useState } from "react";
import { paymentPerProductContext } from "../useContext/PaymentPerProduct";
import { IsInfoContext } from "../useContext/checkInfoContext";
interface CartItem {
  id: number;
  productName: string;
  cost: number;
  status: boolean;
  img: string;
  productDesc: string;
  quantity: number;
  [key: string]: unknown;
}

const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const LightningIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ShoppingCart: React.FC = () => {
  // Dữ liệu giả lập
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("shoppingCart");
    return stored ? JSON.parse(stored) : [];
  });
  const isInfoContext = useContext(IsInfoContext);
  const handleChangeQuantity = (id: number, count: number) => {
    const newItems = cartItems.map((item) => {
      if (item.id === id && item.quantity + count >= 1) {
        return { ...item, quantity: item.quantity + count };
      }
      return item;
    });

    // Cập nhật State (để UI đổi ngay lập tức)
    setCartItems(newItems);

    // Cập nhật LocalStorage (để lưu lại)
    localStorage.setItem("shoppingCart", JSON.stringify(newItems));
  };

  const products = useContext(paymentPerProductContext);

  // Tính tổng từ `cartItems`
  const totalAmount: number = cartItems.reduce(
    (sum: number, item: CartItem) => {
      const cost = Number(item.cost) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + cost * qty;
    },
    0
  );
  const handleCheckIsInfo = () => {
    if (isInfoContext.isInfo === false) {
      alert("Vui lòng điền đầy đủ thông tin người nhận hàng!");
    
    }
  };

  const removeItemByX = (valueA: number): CartItem[] => {
    const newItems = cartItems.filter((item) => item.id !== valueA);
    // Cập nhật state và localStorage ngay lập tức
    setCartItems(newItems);
    try {
      localStorage.setItem("shoppingCart", JSON.stringify(newItems));
    } catch (e) {
      console.error("Lỗi khi cập nhật localStorage:", e);
    }
    if (products && products.handleDeleteProduct)
      products.handleDeleteProduct(valueA);
    return newItems;
  };
  // Khi bấm nút xóa

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.freeShipBanner}>
            Miễn phí vận chuyển&nbsp;
            <span style={{ color: "#333" }}>
              đối với đơn hàng trên 300.000đ
            </span>
          </div>

          {/* Header Row */}
          <div className={styles.headerRow}>
            <div className={`${styles.colCheckbox}`}>
              <input
                type="checkbox"
                className={styles.checkbox}
                defaultChecked
              />
            </div>
            <div className={styles.colProduct}>
              Chọn tất cả ({products.paymentProducts.length})
            </div>
            <div className={styles.colPrice}>Giá thành</div>
            <div className={styles.colQty}>Số lượng</div>
            <div className={styles.colUnit}>Đơn vị</div>
            <div className={styles.colDelete}></div>
          </div>

          {/* Product Item Row */}
          {cartItems.map((item: CartItem) => (
            <div key={item.id}>
              <div className={styles.cartItem}>
                <div className={styles.colCheckbox}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    defaultChecked
                  />
                </div>

                <div className={`${styles.colProduct} ${styles.productInfo}`}>
                  <img
                    src={item.img}
                    alt="Product"
                    className={styles.productImg}
                  />
                  <div>
                    <span className={styles.flashSaleBadge}>
                      <LightningIcon /> Flash sale giá sốc
                    </span>
                    <div className={styles.productName}>{item.productName}</div>
                  </div>
                </div>

                <div className={styles.colPrice}>
                  <span className={styles.currentPrice}>
                    {(item.cost * item.quantity).toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className={styles.colQty}>
                  <div className={styles.qtyGroup}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleChangeQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className={styles.qtyInput}
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleChangeQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.colUnit}>
                  <select className={styles.unitSelect}>
                    <option>Hộp</option>
                    <option>Lọ</option>
                  </select>
                </div>

                <div className={styles.colDelete}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => {
                      removeItemByX(item.id);
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Promotion info inside item card */}
          <div className={styles.itemFooter}>
            <div className={styles.lightningIcon}>
              <LightningIcon />
            </div>
            <span>Giảm ngay 20% khi mua Online 8h - 22h áp dụng đến 01/12</span>
          </div>
        </div>
        {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
        <div className={styles.rightPanel}>
          <div className={styles.couponBar}>
            <span>Áp dụng ưu đãi để được giảm giá</span>
            <ChevronRight />
          </div>

          <div className={styles.summaryRow}>
            <span>Tổng tiền</span>
            <span className={styles.summaryVal}>
              {totalAmount.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Thành tiền</span>
            <div style={{ textAlign: "right" }}>
              <span className={styles.totalPrice}>
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <button
            className={styles.btnCheckout}
            onClick={() => {
             handleCheckIsInfo()
            }}
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
