import React from "react";
import Seachbar from "../components/Searchbar";

import ProductGrid from "../components/ProductGrid";
import CartWidget from "../components/CartWidget";

const Home = () => {
  return (
    <div className="relative">
      <Seachbar />
      <ProductGrid />
      <CartWidget />
    </div>
  );
};

export default Home;
