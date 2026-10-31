# Supplier Management Platform (TransitX)

An end-to-end enterprise logistics, fleet, and supplier management platform featuring real-time route optimization, intermediate consignment capacity maximization, live shipment tracking, expense auditing, and a robust relational MySQL database backend.

---

## 👥 Project Information

- **Project Title:** Supplier Management Platform
- **Mentor:** Dr. Spandana

### Team Members
| Name | Roll Number / ID |
| :--- | :--- |
| **P. Pranaw Reddy** | `2520030136` |
| **P. Anudeep** | `2520030087` |
| **Asritha Chowdary** | `2520030592` |

---

## 🚀 Key Features & Modules

- **Executive Analytics & KPI Dashboard (`/dashboard`):** Real-time visibility into active fleet count, capacity utilization, fuel costs, revenues, operating margins, and live alerts.
- **Route & En-Route Optimizer (`/route-optimizer`):** Interactive map visualization with waypoint breakdown, milestone progress, delay tracking, and corridor optimization.
- **Capacity & Intermediate Ingest Optimizer (`/capacity-optimizer`):** Algorithmic matching of intermediate consignments to trucks with spare weight (tons) and volume (m³) headroom along active transit corridors.
- **Supplier & Shipment Management (`/shipments`):** Dispatch tracking, consignment priorities (Critical, Express, Standard), cargo types (Pharma, Electronics, FMCG, Auto Parts), and allocated cost breakdown.
- **Fleet & Vehicle Telemetry (`/fleet`, `/fleet/:id`):** Real-time GPS coordinates, speed, odometer readings, engine health scores, fuel economy (km/L), and assigned drivers.
- **Driver Performance & Operations (`/drivers`):** Profiles tracking duty status (On Duty, Resting, Standby), safety scores, on-time delivery percentages, and payroll allowances.
- **Maintenance & Workshop Scheduling (`/maintenance`):** Preventive maintenance management, overhaul schedules (brakes, tyres, lubrication), workshop logs, and repair costs.
- **Operational Expense Auditing (`/expenses`):** Detailed expense auditing by category (Fuel, FASTag Tolls, Maintenance, Driver Allowance) with invoice and approval tracking.
- **Profitability & Financial Simulation (`/profitability`):** Unit economics modeling, route margin analysis, and what-if parameter simulations (diesel price, freight rates, fleet utilization).

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS
- **Icons & Visuals:** Lucide React, Framer Motion, Canvas Confetti
- **Maps & Charts:** Leaflet, React-Leaflet, Recharts
- **Router:** React Router v7

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Driver:** `mysql2` (Connection Pooling & Promises)
- **Middleware:** `cors`, `dotenv`

### Database
- **Database Management System:** MySQL 8.0+
- **Schema Name:** `transitx`
- **Features:** Relational integrity, foreign key cascades, structured ENUMs, index optimization.

---

## 🗄️ Database Schema Overview

The relational database model comprises 8 interconnected tables:

1. **`vehicles`**: Stores registration numbers, make/model, status, driver mappings, telemetry, capacity limits, and trip financials.
2. **`vehicle_route_stops`**: Waypoints and milestones for vehicle routes, tracking scheduled ETAs, actual arrivals, and geo-coordinates.
3. **`drivers`**: Driver credentials, contact info, licenses, monthly working hours, performance ratings, and duty states.
4. **`shipments`**: End-to-end customer consignments, priority levels, goods types, allocated costs, revenues, and delivery statuses.
5. **`opportunities`**: Intermediate freight load opportunities analyzed for route compatibility, additional costs, and marginal profits.
6. **`maintenance`**: Scheduled service logs, workshop notes, parts replacement records, and expense accounting.
7. **`expenses`**: Operational receipts covering fuel purchases, toll deductions, petty cash, and payment methods.
8. **`alerts`**: Real-time system notifications for traffic hold-ups, maintenance thresholds, and high-margin load matches.

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server** (v8.0 or higher) running locally on port `3306`

---

### 2. Configure Database Credentials
Create or edit the [`server/.env`](file:///c:/Users/Anudeep_Potnuru/Desktop/DBMS_Hackathon_Project/server/.env) file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=transitx
PORT=3001
```

---

### 3. Initialize & Seed Database
Import the schema and populate the tables with initial dataset:

```powershell
# Open MySQL terminal or PowerShell to load the schema:
Get-Content server/schema.sql | mysql -u root -p

# Populate tables with comprehensive seed data:
npx tsx server/seed.ts
```

---

### 4. Install Dependencies

```powershell
# Install root (frontend) dependencies:
npm install

# Install server (backend) dependencies:
cd server
npm install
cd ..
```

---

### 5. Running the Application

Run both servers in separate PowerShell terminals:

#### **Terminal 1 — Backend API Server**
```powershell
cd c:\Users\Anudeep_Potnuru\Desktop\DBMS_Hackathon_Project
node server/index.js
```
*Backend runs on:* `http://localhost:3001`

#### **Terminal 2 — Frontend Application**
```powershell
cd c:\Users\Anudeep_Potnuru\Desktop\DBMS_Hackathon_Project
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

Open your browser and visit: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check probe |
| `/api/vehicles` | `GET` | Fetch all vehicles with current routes and stops |
| `/api/vehicles/:id` | `GET` | Retrieve specific vehicle details |
| `/api/vehicles/:id/status` | `PATCH` | Update vehicle operating status |
| `/api/vehicles/:id/load` | `PATCH` | Update vehicle weight and volume loads |
| `/api/drivers` | `GET` | Retrieve all driver profiles and performance metrics |
| `/api/drivers/:id` | `GET` | Retrieve specific driver details |
| `/api/shipments` | `GET` | List active, transit, and delivered consignments |
| `/api/shipments` | `POST` | Create a new shipment order |
| `/api/opportunities` | `GET` | List intermediate load profit opportunities |
| `/api/opportunities/:id/accept` | `PATCH` | Accept an opportunity and assign to target vehicle |
| `/api/maintenance` | `GET` | Fetch scheduled and completed maintenance records |
| `/api/maintenance` | `POST` | Schedule a new service entry |
| `/api/expenses` | `GET` | Retrieve operational expenses and receipts |
| `/api/expenses` | `POST` | Record a new fuel, toll, or operational expense |
| `/api/alerts` | `GET` | Fetch system alerts and operational notifications |
| `/api/alerts` | `POST` | Create a new alert |
| `/api/alerts/:id/read` | `PATCH` | Mark a specific alert as read |
| `/api/alerts/read-all` | `PATCH` | Mark all alerts as read |

---

## 📜 License
Developed for DBMS Hackathon Project. All rights reserved.