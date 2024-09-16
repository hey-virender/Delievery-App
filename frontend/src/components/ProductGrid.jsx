import React, { useEffect, useState } from "react";
import SectionToggle from "./SectionToggle";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ProductGrid = () => {
  const navigate = useNavigate();
  const { section } = useSelector((state) => state.product);

  const [fetchedProducts, setFetchedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/products/section/${section}`);

        setFetchedProducts(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchProducts();
  }, [section]);
  return (
    <div>
      <SectionToggle />
      <div className="grid grid-cols-2  gap-3 sm:grid-cols-3 md:grid-cols-4">
        {fetchedProducts.map((product) => (
          <div
            key={product._id}
            className="grid-item flex flex-col items-center bg-slate-500 bg-opacity-25 rounded-xl"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className="h-20 ">
              <img
                className="h-full w-full object-contain"
                src={product.image}
                alt={product.name}
              />
            </div>

            <h3 className="text-lg font-bold">{product.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
