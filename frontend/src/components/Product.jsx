import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QuantitySelector from "./QuantitySelector";
import RelatedProducts from "./RelatedProducts";
import AddToCartButton from "./AddToCartButton";
import BuyButton from "./BuyButton";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import { useShowPopup } from "../utils/popupHandler";
const Product = () => {
  const showPopup = useShowPopup();
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios(`/products/${productId}`);
        setProduct(response.data);
        setFinalPrice(product?.price - product?.discount);
      } catch (error) {
        showPopup("error", "Failed to fetch product");
        console.log(error);
      }
    };
    fetchProduct();
  }, [productId, product?.discount, product?.price, showPopup]);

  return (
    product && (
      <div>
        <div className="mx-auto h-60 w-60">
          <img
            className=" h-full w-full object-contain"
            src={product.image}
            alt={product.name}
          />
        </div>
        <h2 className="font-bold text-xl">{product.name}</h2>
        <div>
          <div>
            MRP: ₹{" "}
            <span className={` ${product.discount > 0 && "line-through"} `}>
              {product.price}
            </span>
          </div>
          {product.discount != 0 && (
            <div className="font-semibold">Discount: ₹{product.discount}</div>
          )}

          <div className="font-bold text-lg">
            Final Price: ₹{finalPrice * quantity}
          </div>
        </div>
        <div className="description-container mt-5">
          <span className="text-lg font-bold">Description</span>
          <p>{product.description}</p>
        </div>
        <QuantitySelector
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
        />
        <div className="mt-4 flex gap-4">
          <AddToCartButton
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
          />
          <BuyButton product={product} quantity={quantity} />
        </div>
        <RelatedProducts product={product} />
      </div>
    )
  );
};

export default Product;
