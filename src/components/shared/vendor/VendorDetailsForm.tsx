import { useState } from 'react';

interface VendorDetails {
  companyName: string;
  legalEntityType?: string;
  taxId?: string;
  headquartersAddress?: string;
  employeeCountRange?: string;
  annualRevenueRange?: string;
  socialLinks: any;
}

const VendorDetailsForm = ({ onSubmit }: { onSubmit: (data: VendorDetails) => void }) => {
  const [formData, setFormData] = useState<VendorDetails>({
    companyName: '',
    socialLinks: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Company Name"
        required
      />
      <input
        type="text"
        name="legalEntityType"
        value={formData.legalEntityType || ''}
        onChange={handleChange}
        placeholder="Legal Entity Type"
      />
      <input
        type="text"
        name="taxId"
        value={formData.taxId || ''}
        onChange={handleChange}
        placeholder="Tax ID"
      />
      <input
        type="text"
        name="headquartersAddress"
        value={formData.headquartersAddress || ''}
        onChange={handleChange}
        placeholder="Headquarters Address"
      />
      <input
        type="text"
        name="employeeCountRange"
        value={formData.employeeCountRange || ''}
        onChange={handleChange}
        placeholder="Employee Count Range"
      />
      <input
        type="text"
        name="annualRevenueRange"
        value={formData.annualRevenueRange || ''}
        onChange={handleChange}
        placeholder="Annual Revenue Range"
      />
      {/* Add other fields here */}
      <button type="submit">Next</button>
    </form>
  );
};

export default VendorDetailsForm;
