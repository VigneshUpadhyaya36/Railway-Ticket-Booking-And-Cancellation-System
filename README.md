# 🚆 Railway Ticket Booking and Cancellation System

CHECKOUT THE WEBSITE - https://railway-ticket-booking-and-cancellation-system.vercel.app
<img width="906" height="403" alt="image" src="https://github.com/user-attachments/assets/4e8660a3-e8f2-44da-b229-72e833eac23b" />

<img width="940" height="762" alt="image" src="https://github.com/user-attachments/assets/d5fe96a4-980a-4e5b-a0ab-860997fd71b1" />

<img width="940" height="443" alt="image" src="https://github.com/user-attachments/assets/889a2dc7-7227-44b3-b55e-05b4d1e69d1d" />


<img width="894" height="416" alt="image" src="https://github.com/user-attachments/assets/0ae4bcae-f225-49fb-877d-b4b52bd1fd8e" />

<img width="940" height="452" alt="image" src="https://github.com/user-attachments/assets/94583424-73f2-4321-86ea-d3c99b6a414d" />





This is a database-driven railway reservation system built with PostgreSQL. It supports train scheduling, seat availability, booking, fare calculation, payment handling, and ticket cancellations.

---

## 📌 Features

- Admin account creation and management
- Passenger registration and storage
- Train scheduling with seat capacity management
- Fare mapping per class
- Ticket booking with class & fare
- Payment and cancellation handling
- Audit trail with timestamps

---

## 🧰 Tech Stack

| Layer          | Technology     |
|----------------|----------------|
| 🧠 Database     | PostgreSQL      |
| 📄 Schema/DDL   | SQL (DDL + DML) |
| 🔒 UUID usage   | gen_random_uuid() |
| 🕒 Timestamps   | `now()`, time zone aware |
| 🚦 Constraints  | `CHECK`, `UNIQUE`, `FOREIGN KEY`, etc. |

---

## 🏗️ Database Schema Overview

- **admin**: Admin login table
- **passenger**: Passenger details
- **train**: Train scheduling
- **fare**: Fare per train & class
- **booking**: Stores bookings (PNR)
- **payment**: Payment record
- **cancellation**: Ticket cancellation & refund

> See the full ER diagram [<img width="941" height="1253" alt="image" src="https://github.com/user-attachments/assets/8cc65f68-688c-4a6c-93f4-2c300d9a0e6c" />](#)

---


