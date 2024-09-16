import React, { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce Function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch Products by Search Query
  const fetchSearchResults = async (searchQuery) => {
    try {
      setIsSearching(true);
      const response = await axios.get(`/products/search?query=${searchQuery}`);

      setSearchResults(response.data);
    } catch (error) {
      setSearchResults([]); // Clear search results if no products found or error occurs
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced version of the fetch function
  const debouncedFetchSearchResults = useCallback(
    debounce((query) => {
      fetchSearchResults(query);
    }, 500),
    []
  );

  // Handle input change and search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      debouncedFetchSearchResults(value); // Trigger API call with debouncing
    } else {
      setSearchResults([]); // Clear search results if input is empty
    }
  };

  return (
    <div className="relative mt-8 w-full bg-slate-700 px-1 bg-opacity-30 rounded-lg md:w-2/3">
      <div className="font-semibold text-lg">
        Let&apos;s find the best food here
      </div>
      <div>
        <input
          className="w-1/2 h-8 focus:outline-none bg-transparent  placeholder:font-normal placeholder:text-slate-700 border-b border-gray-400"
          placeholder="Search Now..."
          type="search"
          value={query}
          onChange={handleSearchChange}
        />
      </div>
      {/* Search Results */}
      {query && searchResults.length > 0 && (
        <div className="absolute top-16 w-1/2 bg-white border border-gray-200 rounded-lg shadow-md z-10">
          <ul>
            {searchResults.map((product) => (
              <li
                key={product._id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/products/${product._id}`)} // You can handle the click
              >
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show 'No Products Found' if no results */}
      {query && !isSearching && searchResults.length === 0 && (
        <div className="absolute top-16 w-1/2 bg-white border border-gray-200 rounded-lg shadow-md z-10 p-2">
          No products found.
        </div>
      )}
    </div>
  );
};

export default Searchbar;
