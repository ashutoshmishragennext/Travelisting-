// src/types/plan.ts
export interface Plan {
    id: string;
    name: string;
    description: string | null;
    price: number;
    validityYears: number;
    commission: number;
    features: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type CreatePlanInput = Omit<Plan, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>;
  export type UpdatePlanInput = Partial<CreatePlanInput> & { isActive?: boolean };
  
  // API Response Types
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
  }
  
  export interface PlanResponse extends ApiResponse<Plan> {}
  export interface PlansResponse extends ApiResponse<Plan[]> {}
  
  // Form Data Type
  export interface PlanFormData {
    name: string;
    description: string;
    price: string;
    validityYears: string;
    commission: string;
    features: string;
  }
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";


const PlanManagement: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    price: '',
    validityYears: '',
    commission: '',
    features: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      
      const  data = await response.json();
      console.log("datttttta",data);
      
      if (error) throw new Error(error);
      if (data) setPlans(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch plans');
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);

      // Validate features JSON
      let parsedFeatures: Record<string, any>;
      try {
        parsedFeatures = formData.features ? JSON.parse(formData.features) : {};
      } catch (e) {
        throw new Error('Invalid JSON in features field');
      }

      const url = currentPlan ? `/api/plans/${currentPlan.id}` : '/api/plans';
      const method = currentPlan ? 'PUT' : 'POST';
      
      const payload: CreatePlanInput | UpdatePlanInput = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        validityYears: parseInt(formData.validityYears),
        commission: parseFloat(formData.commission),
        features: parsedFeatures,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save plan');

      const { data, error } = await response.json();
      if (error) throw new Error(error);
      
      setIsOpen(false);
      fetchPlans();
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save plan');
      console.error('Failed to save plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch(`/api/plans/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete plan');
        
        const { error } = await response.json();
        if (error) throw new Error(error);
        
        await fetchPlans();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete plan');
        console.error('Failed to delete plan:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const editPlan = (plan: Plan): void => {
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price.toString(),
      validityYears: plan.validityYears.toString(),
      commission: plan.commission.toString(),
      features: JSON.stringify(plan.features, null, 2),
    });
    setIsOpen(true);
  };

  const resetForm = (): void => {
    setCurrentPlan(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      validityYears: '',
      commission: '',
      features: '',
    });
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof PlanFormData
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plan Management</h1>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
              <DialogDescription>
                Fill in the details for the plan.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange(e, 'price')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="validityYears">Validity (Years)</Label>
                <Input
                  id="validityYears"
                  type="number"
                  min="1"
                  value={formData.validityYears}
                  onChange={(e) => handleInputChange(e, 'validityYears')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="commission">Commission</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.commission}
                  onChange={(e) => handleInputChange(e, 'commission')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="features">Features (JSON)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange(e, 'features')}
                  placeholder='{"feature1": "value1", "feature2": "value2"}'
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {currentPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">₹{plan.price.toLocaleString('en-IN')}</p>
                <p>Validity: {plan.validityYears} years</p>
                <p>Commission: ₹{plan.commission.toLocaleString('en-IN')}</p>
                {Object.keys(plan.features).length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Features:</p>
                    <ul className="list-disc list-inside">
                      {Object.entries(plan.features).map(([key, value]) => (
                        <li key={key}>
                          {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => editPlan(plan)}
                    disabled={loading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(plan.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanManagement;