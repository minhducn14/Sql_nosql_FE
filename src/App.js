import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from MariaDB
    axios.get('/api/products')
      .then(response => {
        const products = response.data;
        // Fetch images for each product
        const productsWithImagesPromises = products.map(product => 
          axios.get(`/api/products/${product.id}/images`)
            .then(response => ({ ...product, images: response.data }))
        );
        return Promise.all(productsWithImagesPromises);
      })
      .then(productsWithImages => {
        setProducts(productsWithImages);
      })
      .catch(error => {
        console.error('There was an error fetching the products or images!', error);
      });
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <ul>
            {product.images.map(image => (
              <li key={image.id}>
                <img src={image.path} alt={image.name} style={{ width: '100px' }} />
                <p>{image.name}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
