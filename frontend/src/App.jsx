// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
const App = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [price, setPrice] = useState(null);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/stocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchStockPrice = async () => {
    if (selectedStock) {
      try {
        const response = await axios.get(`http://localhost:8080/stocks`);
        const selectedStockData = response.data.find((stock) => stock.symbol === selectedStock);
        
        if (selectedStockData) {
          setPrice(selectedStockData.currentPrice);
        }
      } catch (error) {
        console.error(`Error fetching price for ${selectedStock}:`, error);
      }
    }
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocks();
      fetchStockPrice();
    }, 60000);

    fetchStocks();
    fetchStockPrice();

    return () => clearInterval(interval);
  }, [selectedStock]);

  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
    setPrice(null); // Clear price when selecting a new stock
  };

  return (
    <div className="container">
      <h1 className="heading">Mini Stock Price Tracker</h1>
      <select onChange={handleStockChange} value={selectedStock}  className="select">
        <option value="">Select a stock</option>
        {stocks.map((stock) => (
          <option key={stock._id} value={stock.symbol}>
            {stock.symbol}
          </option>
        ))}
      </select>
      
      {selectedStock && (
        <div className='card'> 
          <h2 className="price-display">Price Display</h2>
          <p className="price-display">
            {selectedStock}: {price !== null ? `${price.toFixed(2)} ₹` : 'Loading...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
