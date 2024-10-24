import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const RelatedProducts = ({ product }) => {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(`/products/${product._id}/related`);
        setRelatedProducts(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchRelatedProducts();
  }, []);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Related Products</h2>
      <Carousel responsive={responsive} arrows={false} swipeable={true}>
        {relatedProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20">
              <img
                className="h-full w-full object-contain"
                src={product.image}
                alt={product.name}
              />
            </div>
            <h3 className="text-lg font-bold">{product.name}</h3>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

RelatedProducts.propTypes = {
  product: PropTypes.object.isRequired,
};

export default RelatedProducts;
