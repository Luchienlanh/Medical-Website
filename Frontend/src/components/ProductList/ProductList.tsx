import React, { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate, createSearchParams, useSearchParams } from "react-router";
import { useProductFetcher, type ApiData } from "../CallApi/CallApiProduct";

import { SortContext } from "../useContext/priceSortContext";
import { IndexContext } from "../useContext/IndexProductContext";

import styles from "./ProductList.module.css";

const PRODUCTS_PER_PAGE = 8;

interface CartItem extends ApiData {
  quantity: number;
}

const DataFetcher: React.FC = () => {
  const { data, loading, error } = useProductFetcher();
  const sortContext = useContext(SortContext);
  const indexContext = useContext(IndexContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const maxPriceQuery = searchParams.get("maxPrice");
  const minPriceQuery = searchParams.get("minPrice");

  const sortedData = useMemo(() => {
    if (!data) return [];
    let dataCopy = [...data];
    if (maxPriceQuery || minPriceQuery) {
      const maxPrice = Number(maxPriceQuery) || 1e9;
      const minPrice = Number(minPriceQuery) || 0;
      dataCopy = dataCopy.filter(
        (item) => item.cost >= minPrice && item.cost <= maxPrice
      );
    }
    switch (sortContext.typeSort) {
      case "lowToHigh":
        return dataCopy.sort((a, b) => a.cost - b.cost);
      case "highToLow":
        return dataCopy.sort((a, b) => b.cost - a.cost);
      default:
        return dataCopy;
    }
  }, [data, sortContext.typeSort, maxPriceQuery, minPriceQuery]);
  useEffect(() => {
    setCurrentPage(1);
  }, [maxPriceQuery, minPriceQuery]);

  // Logic Pagination
  const totalPages = Math.ceil(sortedData.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = sortedData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    if (indexContext) {
      indexContext.ChangeCountIndex(indexOfFirstProduct);
    }
  }, [indexOfFirstProduct, indexContext]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toDetailProduct = (id: number) => {
    navigate({
      pathname: "/DetailProduct",
      search: createSearchParams({ productId: id.toString() }).toString(),
    });
  };

  const handleAddToCart = (item: ApiData) => {
    const cartData = localStorage.getItem("shoppingCart");
    const cartItems: CartItem[] = cartData ? JSON.parse(cartData) : [];
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => String(cartItem.id) === String(item.id)
    );
    if (existingItemIndex < 0) {
      const newItem: CartItem = { ...item, quantity: 1 };
      cartItems.push(newItem);
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  };

  if (loading)
    return (
      <div>
        <strong>Đang tải dữ liệu...</strong>
      </div>
    );
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <>
      <div className={styles.hero}>
        {currentProducts.map((item) => (
          <div
            key={item.id}
            className={styles.component}
            onClick={() => toDetailProduct(item.id)}
          >
            <img src={item.img} alt={item.productName} />
            <div className={styles.desc}>
              {item.productName} <span>hỗ trợ </span> {item.productDesc}
            </div>
            <p className={styles.price}>
              {new Intl.NumberFormat("vi-VN").format(item.cost)}đ
            </p>
            <button
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();

                handleAddToCart(item);
              }}
            >
              Chọn mua
            </button>
          </div>
        ))}
      </div>

      {/* Phần phân trang giữ nguyên */}
      {totalPages > 1 && (
        <nav className={styles.paginationNav}>
          <ul>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? styles.activePage : ""}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};

export default DataFetcher;
