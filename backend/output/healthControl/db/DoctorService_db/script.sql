CREATE TABLE public.Doctors (
  id integer,
  name text,
  surname text,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Doctors OWNER TO postgres;
    
ALTER TABLE ONLY public.Doctors
  ADD CONSTRAINT Doctors_pkey PRIMARY KEY (id);

CREATE TABLE public.Patient_doctor (
  doctorId integer,
  patientId integer,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Patient_doctor OWNER TO postgres;
    


CREATE TABLE public.Patients (
  id integer,
  name text,
  surname text,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Patients OWNER TO postgres;
    
ALTER TABLE ONLY public.Patients
  ADD CONSTRAINT Patients_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.Patient_doctor
  ADD CONSTRAINT Patient_doctor_fkey_0 FOREIGN KEY (patientId) REFERENCES public.Patients(id);

ALTER TABLE ONLY public.Patient_doctor
  ADD CONSTRAINT Patient_doctor_fkey_1 FOREIGN KEY (doctorId) REFERENCES public.Doctors(id);


