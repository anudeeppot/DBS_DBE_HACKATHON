-- ============================================================
-- TransitX CDM — MySQL Database Schema
-- Run this file once to set up the database
-- ============================================================

CREATE DATABASE IF NOT EXISTS transitx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE transitx;

-- ----------------------------------------------------------------
-- VEHICLES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
  id                     VARCHAR(50)  PRIMARY KEY,
  reg_number             VARCHAR(20)  NOT NULL UNIQUE,
  type                   VARCHAR(50)  NOT NULL,
  make_model             VARCHAR(100) NOT NULL,
  status                 ENUM('In Transit','Loading','Idle','Delayed','Maintenance','At Stop','Offline') NOT NULL DEFAULT 'Idle',
  driver_id              VARCHAR(50),
  driver_name            VARCHAR(100),
  driver_phone           VARCHAR(20),
  loc_city               VARCHAR(100),
  loc_state              VARCHAR(100),
  loc_lat                DECIMAL(10,6),
  loc_lng                DECIMAL(10,6),
  loc_heading            INT,
  loc_speed_kmph         INT,
  origin                 VARCHAR(100),
  destination            VARCHAR(100),
  current_stop_index     INT DEFAULT 0,
  total_distance_km      DECIMAL(10,2),
  distance_covered_km    DECIMAL(10,2),
  distance_remaining_km  DECIMAL(10,2),
  eta                    VARCHAR(100),
  max_weight_tons        DECIMAL(8,2),
  current_weight_tons    DECIMAL(8,2),
  max_volume_m3          DECIMAL(8,2),
  current_volume_m3      DECIMAL(8,2),
  mileage_km_per_l       DECIMAL(6,2),
  fuel_price_per_l       DECIMAL(6,2),
  maintenance_rate_per_km DECIMAL(6,2),
  driver_cost_per_km     DECIMAL(6,2),
  odometer_km            INT,
  service_due_in_km      INT,
  health_score           INT,
  total_trip_revenue     DECIMAL(12,2),
  total_trip_cost        DECIMAL(12,2),
  last_updated           VARCHAR(100),
  created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- VEHICLE ROUTE STOPS  (child of vehicles)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_route_stops (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id            VARCHAR(50) NOT NULL,
  stop_order            INT NOT NULL,
  city                  VARCHAR(100),
  state                 VARCHAR(100),
  status                ENUM('completed','current','next','destination','scheduled') NOT NULL,
  eta                   VARCHAR(100),
  actual_arrival        VARCHAR(100),
  distance_from_start_km DECIMAL(10,2),
  latitude              DECIMAL(10,6),
  longitude             DECIMAL(10,6),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------
-- DRIVERS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drivers (
  id                       VARCHAR(50)  PRIMARY KEY,
  name                     VARCHAR(100) NOT NULL,
  code                     VARCHAR(20)  NOT NULL UNIQUE,
  assigned_vehicle_reg     VARCHAR(20),
  phone                    VARCHAR(20),
  license_number           VARCHAR(50),
  license_expiry           VARCHAR(20),
  experience_years         INT,
  base_salary_monthly      DECIMAL(10,2),
  allowance_per_day        DECIMAL(8,2),
  overtime_hours           DECIMAL(6,2),
  working_hours_this_month DECIMAL(6,2),
  current_route            VARCHAR(200),
  rating                   DECIMAL(3,1),
  trips_completed          INT,
  on_time_delivery_rate    DECIMAL(5,2),
  fuel_efficiency_score    DECIMAL(5,2),
  safety_score             DECIMAL(5,2),
  revenue_generated_total  DECIMAL(14,2),
  status                   ENUM('On Duty','Resting','On Leave','Standby') DEFAULT 'Standby',
  photo_url                VARCHAR(500),
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- SHIPMENTS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shipments (
  id                        VARCHAR(50)  PRIMARY KEY,
  tracking_number           VARCHAR(50)  NOT NULL UNIQUE,
  customer_name             VARCHAR(100),
  customer_company          VARCHAR(100),
  origin                    VARCHAR(100),
  destination               VARCHAR(100),
  pickup_date               VARCHAR(50),
  delivery_deadline         VARCHAR(100),
  estimated_delivery        VARCHAR(100),
  actual_delivery           VARCHAR(100),
  weight_tons               DECIMAL(8,2),
  volume_m3                 DECIMAL(8,2),
  package_count             INT,
  goods_type                ENUM('General Cargo','Electronics','Pharmaceuticals','Automotive Parts','Textiles','FMCG','Industrial Machinery'),
  priority                  ENUM('Standard','Express','Critical') DEFAULT 'Standard',
  transport_mode            ENUM('Truck','Train','Flight','Multimodal') DEFAULT 'Truck',
  assigned_vehicle_id       VARCHAR(50),
  assigned_vehicle_reg      VARCHAR(20),
  status                    ENUM('Pending Pickup','In Transit','At Intermediate Hub','Out for Delivery','Delivered','Delayed') DEFAULT 'Pending Pickup',
  is_intermediate_load      TINYINT(1) DEFAULT 0,
  intermediate_pickup_stop  VARCHAR(100),
  intermediate_drop_stop    VARCHAR(100),
  revenue                   DECIMAL(12,2),
  allocated_fuel_cost       DECIMAL(10,2),
  allocated_driver_cost     DECIMAL(10,2),
  allocated_maintenance_cost DECIMAL(10,2),
  allocated_toll_cost       DECIMAL(10,2),
  allocated_handling_cost   DECIMAL(10,2),
  total_cost                DECIMAL(12,2),
  profit                    DECIMAL(12,2),
  profit_margin             DECIMAL(5,2),
  current_progress_pct      INT DEFAULT 0,
  created_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- INTERMEDIATE OPPORTUNITIES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opportunities (
  id                          VARCHAR(50)  PRIMARY KEY,
  shipment_title              VARCHAR(200),
  origin                      VARCHAR(100),
  destination                 VARCHAR(100),
  weight_tons                 DECIMAL(8,2),
  volume_m3                   DECIMAL(8,2),
  package_count               INT,
  goods_type                  ENUM('General Cargo','Electronics','Pharmaceuticals','Automotive Parts','Textiles','FMCG','Industrial Machinery'),
  offered_revenue             DECIMAL(12,2),
  deadline_hours              INT,
  target_vehicle_id           VARCHAR(50),
  target_vehicle_reg          VARCHAR(20),
  vehicle_current_load_tons   DECIMAL(8,2),
  vehicle_max_load_tons       DECIMAL(8,2),
  vehicle_current_volume_m3   DECIMAL(8,2),
  vehicle_max_volume_m3       DECIMAL(8,2),
  route_compatibility_score   INT,
  additional_distance_km      DECIMAL(8,2),
  additional_fuel_cost        DECIMAL(10,2),
  additional_driver_cost      DECIMAL(10,2),
  additional_maintenance_cost DECIMAL(10,2),
  additional_toll_cost        DECIMAL(10,2),
  total_additional_cost       DECIMAL(10,2),
  net_additional_profit       DECIMAL(12,2),
  incremental_margin_pct      DECIMAL(5,2),
  recommendation              ENUM('ACCEPT','REVIEW','REJECT') DEFAULT 'REVIEW',
  recommendation_reason       TEXT,
  is_accepted                 TINYINT(1) DEFAULT 0,
  created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- MAINTENANCE RECORDS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS maintenance (
  id               VARCHAR(50)  PRIMARY KEY,
  vehicle_id       VARCHAR(50),
  vehicle_reg      VARCHAR(20),
  service_type     ENUM('Preventive','Tyre Replacement','Engine Overhaul','Oil & Filter','Brake System','Electrical'),
  scheduled_date   VARCHAR(50),
  completed_date   VARCHAR(50),
  odometer_km      INT,
  cost             DECIMAL(10,2),
  status           ENUM('Good','Service Due','In Maintenance','Critical'),
  workshop         VARCHAR(200),
  mechanic_notes   TEXT,
  next_service_km  INT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- EXPENSE RECORDS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
  id              VARCHAR(50)  PRIMARY KEY,
  date            VARCHAR(20),
  vehicle_reg     VARCHAR(20),
  category        ENUM('Fuel','Driver','Maintenance','Toll','Permits & Taxes','Depreciation','Insurance','Handling'),
  description     TEXT,
  amount          DECIMAL(12,2),
  liters_or_km    DECIMAL(10,2),
  invoice_number  VARCHAR(100),
  payment_method  ENUM('Corporate Fastag','Fuel Card','Direct Transfer','Petty Cash'),
  approved_by     VARCHAR(100),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- SYSTEM ALERTS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
  id          VARCHAR(50)  PRIMARY KEY,
  type        ENUM('delay','maintenance','capacity','shipment','opportunity','financial'),
  severity    ENUM('critical','warning','info','opportunity'),
  title       VARCHAR(200),
  message     TEXT,
  timestamp   VARCHAR(100),
  is_read     TINYINT(1) DEFAULT 0,
  action_url  VARCHAR(500),
  vehicle_reg VARCHAR(20),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
