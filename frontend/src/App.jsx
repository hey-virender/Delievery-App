import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Authenticate from "./pages/Authenticate";
import Home from "./pages/Home";
import Product from "./components/Product";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import PopUpBox from "./components/PopUpBox";
import CompleteOrder from "./pages/CompleteOrder";
import MyOrders from "./pages/MyOrders";
import ManageAddresses from "./pages/ManageAddresses";
function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(!!localStorage.getItem("accessToken"));
  }, [authenticated, setAuthenticated]);

  return (
    <Router>
      <Header />
      <PopUpBox />
      <Routes>
        {authenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/products/:productId" element={<Product />} />
            <Route path="/complete-order" element={<CompleteOrder />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/manage-addresses" element={<ManageAddresses />} />
          </>
        ) : (
          <Route path="/" element={<Authenticate />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
