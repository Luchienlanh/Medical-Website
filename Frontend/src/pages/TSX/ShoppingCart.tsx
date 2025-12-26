import { Footer } from "../../components/HeaderFooter/TSX/Footer";
import { Header } from "../../components/HeaderFooter/TSX/Header";
import CustomerInfo from "../../components/ShoppingCart/CustomerInfo";

import ShoppingCart from "../../components/ShoppingCart/ShoppingCart";

function ShoppingCartPage() {
  return (
    <>
      <Header />
      <ShoppingCart />
      <CustomerInfo />
      <Footer />
    </>
  );
}

export default ShoppingCartPage;
