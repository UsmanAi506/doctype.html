// React component for service selection
import React, { useState } from 'react';

const ServiceTypes = ({ onSelectService }) => {
  const services = [
    { id: 1, name: '1-on-1 Consultation (Video)', price: 2000, currency: 'PKR', duration: '30 min' },
    { id: 2, name: '1-on-1 Consultation (Chat)', price: 1500, currency: 'PKR', duration: '24h response' },
    { id: 3, name: 'Follow-up Session', price: 1500, currency: 'PKR', duration: '20 min' },
    { id: 4, name: 'Family Plan (4 consultations)', price: 6000, currency: 'PKR', duration: '1 month' },
    { id: 5, name: 'International Consultation (USD)', price: 50, currency: 'USD', duration: '30 min' },
    { id: 6, name: 'Second Opinion (Premium)', price: 10000, currency: 'PKR', duration: 'Detailed review' }
  ];

  const [selectedService, setSelectedService] = useState(null);

  const handleSelect = (service) => {
    setSelectedService(service);
    onSelectService(service);
  };

  return (
    <div className="service-types">
      <h3>Select Service Type</h3>
      <div className="services-grid">
        {services.map(service => (
          <div 
            key={service.id} 
            className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
            onClick={() => handleSelect(service)}
          >
            <h4>{service.name}</h4>
            <p>{service.duration}</p>
            <div className="price">
              {service.currency === 'USD' ? '$' : '₨'}{service.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTypes;
