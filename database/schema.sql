CREATE DATABASE IF NOT EXISTS clinic_db;
USE clinic_db;

-- ─────────────────────────────────────────────
-- USERS
-- Roles: 'patient' | 'admin'
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    user_id         INT           AUTO_INCREMENT PRIMARY KEY,
    user_name       VARCHAR(50)   NOT NULL,
    user_email      VARCHAR(50)   NOT NULL UNIQUE,
    user_password   VARCHAR(255)  NOT NULL,          -- bcrypt hash (needs >50 chars)
    user_role       VARCHAR(50)   NOT NULL DEFAULT 'patient',
    user_phone      VARCHAR(50)   NOT NULL,
    user_create_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- DOCTORS
-- Managed by admin only — no login account
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id             INT          AUTO_INCREMENT PRIMARY KEY,
    doctor_name           VARCHAR(50)  NOT NULL,
    doctor_specialization VARCHAR(50)  NOT NULL,
    doctor_email          VARCHAR(50)  NOT NULL UNIQUE,
    doctor_phone          VARCHAR(50)  NOT NULL
);

-- ─────────────────────────────────────────────
-- APPOINTMENTS
-- patient_id → users(user_id)
-- doctor_id  → doctors(doctor_id)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id      INT          AUTO_INCREMENT PRIMARY KEY,
    patient_id          INT          NOT NULL,
    doctor_id           INT          NOT NULL,
    appointment_date    DATE         NOT NULL,
    appointment_time    TIME         NOT NULL,
    appointment_status  VARCHAR(50)  NOT NULL DEFAULT 'pending',
    appointment_reason  TEXT         NULL,
    appointment_create_at DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appt_patient
        FOREIGN KEY (patient_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_appt_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
        ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- MEDICAL RECORDS
-- appointment_id → appointments(appointment_id)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medical_records (
    mr_id           INT   AUTO_INCREMENT PRIMARY KEY,
    appointment_id  INT   NOT NULL,
    mr_diagnosis    TEXT  NOT NULL,
    mr_treatment    TEXT  NOT NULL,
    mr_notes        TEXT,

    CONSTRAINT fk_mr_appointment
        FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- AUDIT LOGS
-- user_id → users(user_id)
-- Auto-populated by the backend on every action
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
    auditlogs_id        INT          AUTO_INCREMENT PRIMARY KEY,
    user_id             INT          NOT NULL,
    auditlogs_action    VARCHAR(100) NOT NULL,
    auditlogs_logtime   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    auditlogs_ipaddress VARCHAR(50)  NOT NULL,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
