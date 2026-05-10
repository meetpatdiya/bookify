import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyBooking.css"
const MyBookings = () => {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/booking?email=${email}`,
      );
      setBookings(data);
      setSearched(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleConfirm = async () => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/booking?email=${email}`,
        { status: "Confirmed" },
      );
      fetchBookings();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleComplete = async () => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/booking?email=${email}`,
        { status: "Completed" },
      );
      fetchBookings();

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
 return (
  <div className="mybook-page">
    <div className="mybook-header">
      <h1>My Bookings</h1>

      <div className="mybook-search">
        <input
          type="email"
          placeholder="Enter your email to find bookings"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mybook-input"
        />

        <button className="mybook-btn" onClick={fetchBookings}>
          Search
        </button>
      </div>
    </div>

    {!searched ? (
      <div className="mybook-empty">Enter email and search bookings</div>
    ) : bookings.length === 0 ? (
      <div className="mybook-empty">No Bookings Found</div>
    ) : (
      <div className="mybook-grid">
        {bookings.map((b) => (
          <div className="mybook-card" key={b._id}>
            <div className="mybook-card-top">
              <span className="mybook-status">{b.status}</span>
            </div>

            <div className="mybook-info">
              <p><b>Expert ID:</b> {b.expert_id}</p>
              <p><b>Date:</b> {b.date}</p>
              <p><b>Time:</b> {b.timeslot}</p>
            </div>

            <div className="mybook-actions">
              <button
                className="mybook-confirm"
                onClick={() => handleConfirm(b._id)}
              >
                Confirm
              </button>

              <button
                className="mybook-complete"
                onClick={() => handleComplete(b._id)}
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default MyBookings;
