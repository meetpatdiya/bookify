import React from "react";
import { Routes, Route } from "react-router-dom";
import Listing from "./Components/Listing";
import ExpertDetails from "./Components/ExpertsDetail";
import MyBookings from "./Components/MyBookings";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Listing />} />
        <Route path="/expert/:id" element={<ExpertDetails />} />
        <Route path="/mybooking" element={<MyBookings />} />
      </Routes>
    </>
  );
};

export default App;
