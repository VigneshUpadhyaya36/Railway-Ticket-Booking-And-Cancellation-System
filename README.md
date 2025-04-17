# 🚆 Railway Ticket Booking and Cancellation System

CHECKOUT THE WEBSITE - https://railway-ticket-booking-and-cancellation-system.vercel.app

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

> See the full ER diagram [here](#) *(Upload image or use PlantUML live link)*

---

## 🚀 Getting Started

### Prerequisites
- PostgreSQL installed
- pgAdmin or terminal access

### Steps
1. Clone the repo  
   ```bash
   git clone https://github.com/vigneshupadhyaya36/railway-ticket-booking-and-cancellation-system.git
