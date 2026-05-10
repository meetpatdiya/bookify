# Bookify: Expert Booking Platform

A full-stack Expert Booking Platform where users can browse experts, check available slots, and book appointments online.  
Built using modern web technologies with real-time booking updates.

---

# Features

- Browse all experts
- View expert details
- Check available time slots
- Book appointments
- Booking status system
- Real-time updates
- Pagination support
- Responsive UI

---

# Tech Stack

## Frontend
- React.js
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

---

# Database Collections


## experts

```js
{
  name,
  category,
  experience,
  rating,
  price,
  language,
  about
}
```

## slots

```js
{
  expert_id,
  date,
  start_time,
  is_booked
}
```

## bookings

```js
{
  expert_id,
  slot_id,
  name,
  email,
  phone,date,
  timeslot,
  notes
  status,
}
```

---

# Author

Made by Meet Patadiya
