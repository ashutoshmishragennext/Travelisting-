// // components/VendorServiceForm.tsx
// import React from 'react';
// import { useFieldArray, useFormContext } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select } from '@/components/ui/select';
// import { Card } from '@/components/ui/card';
// import type { VendorService } from '../types/vendor';

// export const VendorServiceForm = () => {
//   const { register, control } = useFormContext();
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "services"
//   });

//   return (
//     <Card className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Services</h2>
      
//       {fields.map((field, index) => (
//         <div key={field.id} className="space-y-4 mb-6 p-4 border rounded">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Service Name</label>
//               <Input {...register(`services.${index}.service.name`)} />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Experience (Years)</label>
//               <Input
//                 type="number"
//                 {...register(`services.${index}.experienceYears`)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Client Count</label>
//               <Input
//                 type="number"
//                 {...register(`services.${index}.clientCount`)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Pricing Model</label>
//               <Select {...register(`services.${index}.pricingModel`)}>
//                 <option value="hourly">Hourly</option>
//                 <option value="fixed">Fixed</option>
//                 <option value="project">Project-based</option>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Rate Range (Min)</label>
//               <Input
//                 type="number"
//                 step="0.01"
//                 {...register(`services.${index}.rateRangeMin`)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Rate Range (Max)</label>
//               <Input
//                 type="number"
//                 step="0.01"
//                 {...register(`services.${index}.rateRangeMax`)}
//               />
//             </div>
//           </div>
          
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={() => remove(index)}
//           >
//             Remove Service
//           </Button>
//         </div>
//       ))}

//       <Button
//         type="button"
//         variant="outline"
//         onClick={() => append({
//           service: { name: '', description: '', requiredCertifications: [] },
//           experienceYears: 0,
//           clientCount: 0,
//           pricingModel: 'hourly',
//           isActive: true
//         })}
//       >
//         Add Service
//       </Button>
//     </Card>
//   );
// };

// // components/VendorCertificationForm.tsx
// import React from 'react';
// import { useFieldArray, useFormContext } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import type { Certification } from '../types/vendor';

// export const VendorCertificationForm = () => {
//   const { register, control } = useFormContext();
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "certifications"
//   });

//   return (
//     <Card className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Certifications</h2>
      
//       {fields.map((field, index) => (
//         <div key={field.id} className="space-y-4 mb-6 p-4 border rounded">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Certification Name</label>
//               <Input {...register(`certifications.${index}.name`)} />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Issuing Body</label>
//               <Input {...register(`certifications.${index}.issuer`)} />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Issue Date</label>
//               <Input
//                 type="date"
//                 {...register(`certifications.${index}.issueDate`)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Expiry Date</label>
//               <Input
//                 type="date"
//                 {...register(`certifications.${index}.expiryDate`)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Certificate Number</label>
//               <Input {...register(`certifications.${index}.certificationNumber`)} />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Verification URL</label>
//               <Input {...register(`certifications.${index}.verificationUrl`)} />
//             </div>
//           </div>
          
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={() => remove(index)}
//           >
//             Remove Certification
//           </Button>
//         </div>
//       ))}

//       <Button
//         type="button"
//         variant="outline"
//         onClick={() => append({
//           name: '',
//           issuer: '',
//           issueDate: new Date(),
//           expiryDate: new Date(),
//         })}
//       >
//         Add Certification
//       </Button>
//     </Card>
//   );
// };