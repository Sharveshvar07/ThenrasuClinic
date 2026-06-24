
CREATE DATABASE clinic_db;

CREATE TABLE specialities (
  id          SERIAL  PRIMARY KEY,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL,
  icon        TEXT    NOT NULL,
  doctor_name TEXT    NOT NULL,
  available   BOOLEAN NOT NULL DEFAULT true
);



CREATE TABLE appointments (
  id               SERIAL    PRIMARY KEY,
  patient_name     TEXT      NOT NULL,
  patient_age      INTEGER   NOT NULL,
  patient_gender   TEXT      NOT NULL,
  patient_phone    TEXT      NOT NULL,
  patient_email    TEXT,
  specialty_id     INTEGER   NOT NULL REFERENCES specialties(id),
  appointment_date TEXT      NOT NULL,
  appointment_time TEXT      NOT NULL,
  reason           TEXT,
  status           TEXT      NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO specialities (name, description, icon, doctor_name, available) VALUES
  ('Family Medicine',  'Comprehensive primary care for all ages — from newborns to seniors.',       'Heart',       'Dr. Thennarasu', true),
  ('Dental Care',      'Complete dental solutions including cleanings, fillings, and extractions.',  'Smile',       'Dr. Thennarasu', true),
  ('Facial Care',      'Specialized facial treatments and non-surgical cosmetic procedures.',        'Sparkles',    'Dr. Thennarasu', true),
  ('Dental Implants',  'Permanent tooth replacement that looks and feels like natural teeth.',       'Shield',      'Dr. Thennarasu', true),
  ('Preventive Care',  'Health screenings, vaccinations, and wellness check-ups.',                  'Activity',    'Dr. Thennarasu', true),
  ('Pediatric Care',   'Gentle child-friendly healthcare — growth monitoring and immunizations.',   'Baby',        'Dr. Thennarasu', true),
  ('Women''s Health',  'Gynaecology, reproductive health, and wellness check-ups for women.',       'Users',       'Dr. Thennarasu', true),
  ('General Surgery',  'Minor surgical procedures and wound care in a safe clinical environment.',  'Stethoscope', 'Dr. Thennarasu', true);

SELECT * FROM specialities;

drop table specialities;

SELECT COUNT(*) FROM specialties;

SELECT session_user;
 