import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Listing.css"
import { useNavigate } from "react-router-dom";
const Listing = () => {
  const [expertsData, setexpertsData] = useState({});
  const [expertsArray, setexpertsArray] = useState([]);
  const [pageIndex, setpageIndex] = useState(1);
  const [search, setsearch] = useState("");
  const [category, setcategory] = useState("");
  const [categoryList, setcategoryList] = useState([]);
  const navigate = useNavigate();
  const getData = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/experts?page=${pageIndex}&name=${search}&category=${category}`,
    );
    console.log(data);
    setexpertsData(data);
    setexpertsArray(data.experts);
    console.log(expertsArray);
  };
  const getCategories = async () => {
    const { data } = await axios.get("http://localhost:3000/categories");
    setcategoryList(data);
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getData();
  }, [pageIndex, search, category]);
 return (
  <div className="experts-page">
    <div className="experts-header">
      <h1>Book Financial Experts</h1>

      <div className="experts-filters">
        <input
          className="experts-search"
          type="text"
          placeholder="Search experts..."
          value={search}
          onChange={(e) => {
            setsearch(e.target.value);
            setpageIndex(1);
          }}
        />

        <select
          className="experts-select"
          value={category}
          onChange={(e) => {
            setcategory(e.target.value);
            setpageIndex(1);
          }}
        >
          <option value="">All Categories</option>
          {categoryList.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button className="experts-bookings-btn" onClick={() => navigate("/mybooking")}>
          My Bookings
        </button>
      </div>
    </div>

    <div className="experts-grid">
      {expertsArray?.map((item, index) => (
        <div
          key={index}
          className="experts-card"
          onClick={() => navigate(`/expert/${item._id}`)}
        >
          <div className="experts-card-top">
            <h3>{item.name}</h3>
            <span className="experts-rating">⭐ {item.rating}</span>
          </div>

          <p className="experts-category">{item.category}</p>

          <div className="experts-meta">
            <span>{item.experience} yrs experience</span>
          </div>

          <button className="experts-view-btn">View & Book</button>
        </div>
      ))}
    </div>

    <div className="experts-pagination">
      <button
        disabled={expertsData.currentPage == 1}
        onClick={() => setpageIndex((p) => p - 1)}
      >
        Prev
      </button>

      <span>
        {expertsData.currentPage} / {expertsData.totalPages}
      </span>

      <button
        disabled={expertsData.totalPages == expertsData.currentPage}
        onClick={() => setpageIndex((p) => p + 1)}
      >
        Next
      </button>
    </div>
  </div>
);
};

export default Listing;
