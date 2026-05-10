import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./ExpertsDetail.css"
const ExpertsDetail = () => {
  const [expertData, setExpertData] = useState({});
  const [slot, setslot] = useState([]);
  const [showform, setshowform] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [slotId, setSlotId] = useState("");
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
  const socket = io("http://localhost:3000");
  socket.on("slot_updated", (data) => {
    setslot((prev) =>
      prev.map((s) =>
        s._id === data.slot_id
          ? { ...s, is_booked: true }
          : s
      )
    );
  });

  return () => socket.disconnect();
}, []);
  const getExpertDetail = async () => {
    const { data } = await axios.get(`http://localhost:3000/experts/${id}`);
    setExpertData(data.expert);
    setslot(data.slots);
    console.log(data);
  };
  useEffect(() => {
    getExpertDetail();
  }, [id]);
  const confirmBooking = async (e) => {
    e.preventDefault();
    let isvalid = true;
    let newErrors = {
      name: "",
      email: "",
      phone: "",
      date: "",
      timeslot: "",
      notes: "",
    };
    if (name.trim() === "") {
      newErrors.name = "Name is required";
      isvalid = false;
    }
    if (email.trim() === "") {
      newErrors.email = "Email is required";
      isvalid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email";
      isvalid = false;
    }
    if (phone.toString().trim() === "") {
      newErrors.phone = "Phone is required";
      isvalid = false;
    } else if (phone.toString().trim().length !== 10) {
      newErrors.phone = "Phone must be 10 digits";
      isvalid = false;
    }
    if (selectedDate.trim() === "") {
      newErrors.date = "Date is required";
      isvalid = false;
    }

    if (selectedTimeSlot.trim() === "") {
      newErrors.timeslot = "Timeslot is required";
      isvalid = false;
    }

    if (notes.trim() === "") {
      newErrors.notes = "Notes is required";
      isvalid = false;
    } else if (notes.length < 10) {
      newErrors.notes = "Notes should be 10 charachters long";
      isvalid = false;
    }
    setErrors(newErrors || {});
    if (!isvalid) return;
    try {
      const { data } = await axios.post(
        "http://localhost:3000/booking",
        {
          expert_id: id,
          email: email,
          name: name,
          slot_id: slotId,
          phone: phone,
          date: selectedDate,
          timeslot: selectedTimeSlot,
          notes: notes,
        },
        { withCredentials: true },
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
  <div className="details-page">

    <div className="details-card">
      <p><b>Name:</b> {expertData?.name}</p>
      <p><b>Rating:</b> ⭐ {expertData?.rating}</p>
      <p><b>About:</b> {expertData?.about}</p>
      <p><b>Price:</b> ₹{expertData?.price}</p>

      <div>
        <b>Languages:</b>
        <div>
          {expertData?.language?.map((item, index) => (
            <span key={index} className="details-lang">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="details-slots">
     {[...new Set(slot.map((item) => item.date))].map((date, index) => {
  const availableSlots = slot.filter(
    (item) => item.date === date && item.is_booked === false
  );

  return (
    <div key={index}>
      <h3 className="details-date">{date}</h3>

      {availableSlots.length === 0 ? (
        <p className="details-no-slot">
          All Slots are Booked  
        </p>
      ) : (
        availableSlots.map((item) => (
          <span key={item._id} className="details-slot">
            {item.timeslot}
          </span>
        ))
      )}
    </div>
  );
})}
    </div>

    <button
      className="details-btn"
      disabled={slot.length === 0}
      onClick={() => setshowform(true)}
    >
      Book Expert
    </button>

    {showform && (
      <div className="form-overlay">
        <form className="form" onSubmit={confirmBooking} noValidate>

          <h2 className="mybook-title">Book Expert  <span className="mybook-cross" onClick={()=>setshowform(false)}>×</span></h2>

          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>{errors.name}</p>

          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>{errors.email}</p>

          Phone Number
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p>{errors.phone}</p>

          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              if (e.target.value !== "") {
                setErrors((prev) => ({ ...prev, date: "" }));
              }
            }}
          >
            <option value="">Select Date</option>
            {[
              ...new Set(
                slot
                  .filter((item) => item.is_booked === false)
                  .map((item) => item.date)
              ),
            ].map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
          <p>{errors.date}</p>

          <select
            value={slotId}
            onChange={(e) => {
              const id = e.target.value;
              setSlotId(id);

              const selected = slot.find((s) => s._id === id);
              setSelectedTimeSlot(selected ? selected.timeslot : "");

              if (id !== "") {
                setErrors((prev) => ({ ...prev, timeslot: "" }));
              }
            }}
          >
            <option value="">Select Time Slot</option>

            {slot
              .filter(
                (item) =>
                  item.date === selectedDate && item.is_booked === false
              )
              .map((item) => (
                <option key={item._id} value={item._id}>
                  {item.timeslot}
                </option>
              ))}
          </select>
          <p>{errors.timeslot}</p>

          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p>{errors.notes}</p>
          <button type="submit">Confirm Booking</button>
        </form>
      </div>
    )}
  </div>
);
};

export default ExpertsDetail;
