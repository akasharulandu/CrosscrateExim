import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductCard = ({ product, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100" onClick={() => onClick(product)} style={{ cursor: 'pointer' }}>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        <div className="card-body text-center">
          <h5 className="card-title">{product.name}</h5>
          {/* <p className={`card-text ${expanded ? '' : 'text-truncate-description'}`}>
            {product.description}
          </p>
          {product.description?.split(' ').length > 20 && (
            <button
              className="btn btn-link p-0"
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                setExpanded(!expanded);
              }}
            >
              {expanded ? 'Show Less' : 'Read More'}
            </button>
          )} */}
          {/* <p className="text-success">Price: ₹{product.price}</p> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
