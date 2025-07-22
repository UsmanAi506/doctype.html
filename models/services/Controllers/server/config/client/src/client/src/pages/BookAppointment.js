import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceTypes from '../components/ServiceTypes';
import DoctorSelection from '../components/DoctorSelection';
import CalendarPicker from '../components/CalendarPicker';
import PaymentMethod from '../components/PaymentMethod';
import Confirmation from '../components/Confirmation';
import { useAuth } from '../context/AuthContext';
import './BookAppointment.css';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [accountDetails, setAccountDetails] = useState({
    accountName: 'MUHAMMAD USMAN MALIK',
    IBAN: 'PK02SCBL000000117229277701'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [appointment, setAppointment] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/appointments', {
        doctorId: doctor._id,
        date,
        time,
        serviceType: service.id,
        paymentMethod,
        accountDetails
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setAppointment(response.data.appointment);
      setSuccess(true);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="book-appointment">
      <h2>Book Appointment</h2>
      
      {step === 1 && (
        <ServiceTypes 
          onSelect={setService} 
          selected={service} 
          onNext={nextStep} 
        />
      )}
      
      {step === 2 && (
        <DoctorSelection 
          specialty={service?.specialty} 
          onSelect={setDoctor} 
          selected={doctor} 
          onNext={nextStep} 
          onBack={prevStep} 
        />
      )}
      
      {step === 3 && (
        <CalendarPicker 
          doctor={doctor} 
          onSelectDate={setDate} 
          onSelectTime={setTime} 
          selectedDate={date} 
          selectedTime={time} 
          onNext={nextStep} 
          onBack={prevStep} 
        />
      )}
      
      {step === 4 && (
        <PaymentMethod 
          amount={service?.price} 
          currency={service?.currency} 
          method={paymentMethod} 
          onMethodChange={setPaymentMethod} 
          accountDetails={accountDetails} 
          onDetailsChange={setAccountDetails} 
          onSubmit={handleSubmit} 
          loading={loading} 
          error={error} 
          onBack={prevStep} 
        />
      )}
      
      {step === 5 && success && (
        <Confirmation 
          appointment={appointment} 
          onFinish={() => navigate('/patient')} 
        />
      )}
    </div>
  );
};

export default BookAppointment;
