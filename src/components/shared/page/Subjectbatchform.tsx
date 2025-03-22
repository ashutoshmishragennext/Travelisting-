// "use client"
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from "@/components/ui/use-toast";
// import { 
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from '@/components/ui/scroll-area';

// import { 
//   Phase, 
//   Subject, 
//   subjectBatchSchema, 
//   SubjectBatchSchemaType,
//   LECTURE_TYPES,
//   SubjectBatch
// } from './type';

// // Generate current year and previous/next few years
// const generateAcademicYears = () => {
//   const currentYear = new Date().getFullYear();
//   const years = [];
//   for (let i = -4; i <= 2; i++) {
//     years.push(currentYear + i);
//   }
//   return years.map(year => year.toString());
// };

// interface SubjectBatchFormProps { 
//   subjectBatch?: SubjectBatch | null , 
//   phases: Phase[],
//   onClose: () => void,
//   onSubmitSuccess: () => void
// }

// export const SubjectBatchForm: React.FC<SubjectBatchFormProps> = ({ 
//   subjectBatch, 
//   phases,
//   onClose,
//   onSubmitSuccess
// }) => {
//   const ACADEMIC_YEARS = generateAcademicYears();

//   const [selectedPhase, setSelectedPhase] = useState<string>(
//     subjectBatch 
//       ? phases.find(p => 
//           phases.some(phase => 
//             phase.id === subjectBatch.subjectId
//           )
//         )?.id || '' 
//       : ''
//   );
//   const [subjects, setSubjects] = useState<Subject[]>([]);

//   const form = useForm<SubjectBatchSchemaType>({
//     resolver: zodResolver(subjectBatchSchema),
//     defaultValues: subjectBatch ? {
//       ...subjectBatch,
//       startDate: subjectBatch.startDate ? new Date(subjectBatch.startDate) : undefined,
//       endDate: subjectBatch.endDate ? new Date(subjectBatch.endDate) : undefined,
//       academicYear: subjectBatch.academicYear || ACADEMIC_YEARS[2] // Default to current year
//     } : {
//       lectureType: "Lecture / Theory",
//       isActive: true,
//       academicYear: ACADEMIC_YEARS[2] // Default to current year
//     }
//   });

//   // Fetch subjects for a selected phase
//   const fetchSubjects = async (phaseId: string) => {
//     try {
//       const response = await fetch(`/api/subject?phaseId=${phaseId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch subjects');
//       }
//       const data: Subject[] = await response.json();
//       setSubjects(data);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: (error as Error).message,
//         variant: "destructive"
//       });
//     }
//   };

//   const onSubmit = async (values: SubjectBatchSchemaType) => {
//     try {
//       const formData = new FormData();
//       Object.entries(values).forEach(([key, value]) => {
//         if (value !== undefined) {
//           formData.append(key, 
//             value instanceof Date 
//               ? value.toISOString() 
//               : value.toString()
//           );
//         }
//       });

//       const url = subjectBatch 
//         ? `/api/subjectBatch?id=${subjectBatch.id}` 
//         : '/api/subjectBatch';
//       const method = subjectBatch ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${subjectBatch ? 'update' : 'create'} subject batch`);
//       }

//       // Success callback
//       onSubmitSuccess();

//       toast({
//         title: "Success",
//         description: `Subject Batch ${subjectBatch ? 'updated' : 'created'} successfully!`,
//       });

//       // Close modal
//       onClose();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: (error as Error).message,
//         variant: "destructive"
//       });
//     }
//   };
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <ScrollArea className="h-[500px]  pr-4">
//           <div className="space-y-4 pr-2">
//             {/* Academic Year Selection */}
//             <FormField
//               control={form.control}
//               name="academicYear"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Academic Year</FormLabel>
//                   <Select 
//                     onValueChange={field.onChange}
//                     value={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Academic Year" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {ACADEMIC_YEARS.map((year) => (
//                         <SelectItem key={year} value={year}>
//                           {year}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Phase Selection */}
//             <FormItem>
//               <FormLabel>Select Phase</FormLabel>
//               <Select 
//                 onValueChange={(phaseId) => {
//                   setSelectedPhase(phaseId);
//                   fetchSubjects(phaseId);
//                 }}
//                 value={selectedPhase}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Phase" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {phases.map((phase) => (
//                     <SelectItem key={phase.id} value={phase.id}>
//                       {phase.name} - {phase.phaseType} ({phase.academicYear})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </FormItem>

//             {/* Subject Selection */}
//             <FormField
//               control={form.control}
//               name="subjectId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Select Subject</FormLabel>
//                   <Select 
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     disabled={!selectedPhase}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Subject" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {subjects.map((subject) => (
//                         <SelectItem key={subject.id} value={subject.id}>
//                           {subject.name} ({subject.code})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Lecture Type */}
//             <FormField
//               control={form.control}
//               name="lectureType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Lecture Type</FormLabel>
//                   <Select 
//                     onValueChange={field.onChange}
//                     value={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Lecture Type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {LECTURE_TYPES.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Total Sessions (Optional) */}
//             <FormField
//               control={form.control}
//               name="totalSessions"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Total Sessions (Optional)</FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="number" 
//                       placeholder="Enter total sessions" 
//                       {...field} 
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Completed Sessions (Optional) */}
//             <FormField
//               control={form.control}
//               name="completedSessions"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Completed Sessions (Optional)</FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="number" 
//                       placeholder="Enter completed sessions" 
//                       {...field} 
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Start Date (Optional) */}
//             <FormField
//               control={form.control}
//               name="startDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Start Date (Optional)</FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="date" 
//                       {...field} 
//                       value={field.value ? (field.value as Date).toISOString().split('T')[0] : ''}
//                       onChange={(e) => field.onChange(new Date(e.target.value))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* End Date (Optional) */}
//             <FormField
//               control={form.control}
//               name="endDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>End Date (Optional)</FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="date" 
//                       {...field} 
//                       value={field.value ? (field.value as Date).toISOString().split('T')[0] : ''}
//                       onChange={(e) => field.onChange(new Date(e.target.value))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Active Status */}
//             <FormField
//               control={form.control}
//               name="isActive"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                   <FormLabel>Is Active</FormLabel>
//                 </FormItem>
//               )}
//             />
//           </div>
//         </ScrollArea>

//         <Button type="submit" className="w-full mt-4">
//           {subjectBatch ? 'Update Subject Batch' : 'Add Subject Batch'}
//         </Button>
//       </form>
//     </Form>
//   );
// };