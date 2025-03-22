import { useState } from 'react';

const VendorServicesForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [services, setServices] = useState<any[]>([]);

  const addService = () => {
    setServices([...services, { serviceId: '', experienceYears: '', clientCount: '', pricingModel: '', rateRangeMin: '', rateRangeMax: '', currency: '' }]);
  };

  const handleServiceChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedServices = [...services];
    updatedServices[index][name] = value;
    setServices(updatedServices);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(services);
  };

  return (
    <form onSubmit={handleSubmit}>
      {services.map((service, index) => (
        <div key={index}>
          <input
            type="text"
            name="serviceId"
            value={service.serviceId}
            onChange={(e) => handleServiceChange(index, e)}
            placeholder="Service ID"
          />
          <input
            type="text"
            name="experienceYears"
            value={service.experienceYears}
            onChange={(e) => handleServiceChange(index, e)}
            placeholder="Experience Years"
          />
          {/* Add other service fields here */}
        </div>
      ))}
      <button type="button" onClick={addService}>Add Service</button>
      <button type="submit">Next</button>
    </form>
  );
};

export default VendorServicesForm;
