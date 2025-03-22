import { z } from "zod";

// Interfaces for Phase and Subject
export interface Phase {
  id: string;
  name: string;
  phaseType: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  phaseId: string;
}

export interface SubjectBatch {
  academicYear: string;
  id?: string;
  subjectId: string;
  batchId?: string;
  lectureType: string;
  totalSessions?: number;
  completedSessions?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

// Lecture Types
export const LECTURE_TYPES = [
  "Lecture / Theory",
  "Practical", 
  "Morning Posting", 
  "Family Adoption Programme", 
  "Self Directed Learning", 
  "Small Gp Discussion", 
  "AETCOM", 
  "Pandemic Module", 
  "Sports/ Yoga & Extra Curricular Activities", 
  "Electives"
] as const;

// Generate academic years dynamically
export const ACADEMIC_YEARS = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push(`${i}-${i + 1}`);
  }
  return years;
})();

// Zod schema for subject batch validation
export const subjectBatchSchema = z.object({
  subjectId: z.string().uuid({ message: "Subject is required" }),
  batchId: z.string().uuid().optional(),
  lectureType: z.enum(LECTURE_TYPES),
  academicYear: z.string().optional(),
  totalSessions: z.coerce.number().min(1, { message: "Total sessions must be at least 1" }).optional(),
  completedSessions: z.coerce.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: z.boolean().optional()
});

// Infer the Zod schema type
export type SubjectBatchSchemaType = z.infer<typeof subjectBatchSchema>;