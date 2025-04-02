import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import Loader from '../shared/Loader';
import ContactInfo from '../vendorpage/ContectInfo';
import ContactInfo2 from '../vendorpage/SelectDate';

// Define the type for the form data
interface FormData {
  primaryContactName: string;
  primaryContactPhone: string;
  whatsappnumber: string;
  primaryContactEmail: string;
  anotherMobileNumbers: string[];
  anotheremails: string[];
  businessOpeningDays: string[];
  businessTiming: {
    start: string;
    end: string;
  };
}

// Define props interface for the component
interface ContactInfoPageProps {
  vendorId: string | number;
}

const ContactInfoPage = ({ vendorId }: ContactInfoPageProps) => {
  const [formData, setFormData] = useState<FormData>({
    primaryContactName: '',
    primaryContactPhone: '',
    whatsappnumber: '',
    primaryContactEmail: '',
    anotherMobileNumbers: [],
    anotheremails: [],
    businessOpeningDays: [],
    businessTiming: {
      start: '09:00',
      end: '17:00'
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, [vendorId]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vendor?id=${vendorId}`);
      const { success, data, error } = await response.json();
      
      if (success && data) {
        setFormData(data as FormData);
      } else {
        setError(error || 'Failed to fetch contact data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/vendor?id=${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save contact data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateData = (data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <Card className="border-none">
        {error && (
          <Alert variant="destructive" className="mx-6 mt-4">
            <AlertDescription className="flex items-center justify-between">
              {error}
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mx-6 mt-4 bg-green-50 border-green-200">
            <AlertDescription className="flex items-center text-green-800">
              <Check className="mr-2" size={16} />
              Contact information saved successfully
            </AlertDescription>
          </Alert>
        )}

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ContactInfo
              data={formData}
              updateData={handleUpdateData} handleNextStep={function (): void {
                throw new Error('Function not implemented.');
              } }            />
            
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfoPage;