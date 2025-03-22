import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface StudentData {
  student_subject_batches: {
    id: string;
    studentId: string;
    subjectBatchId: string;
    enrollmentDate: string;
    status: string;
  };
  students: {
    id: string;
    rollNumber: string;
    enrollmentNumber: string;
    studentName: string;
    fatherName: string;
    fatherEmail: string;
  };
}

interface AttendanceTableProps {
  students: any[];
  checkedStudents: boolean[];
  markAbsent: boolean[];
  onCheckChange: (index: number) => void;
  onAbsentChange: (index: number) => void;
  onSubmit: () => void;
  onClearAll: () => void;
  onAbsentAll: () => void;
  onCheckAll: () => void;
}
export const ViewAttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  checkedStudents,
  markAbsent,
  onCheckChange,
  onAbsentChange,
  onSubmit,
  onClearAll,
  onAbsentAll,
  onCheckAll,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    // Find students who are not marked as present or absent
    const unmarkedStudents = students.filter((_, index) => {
      return !checkedStudents[index] && !markAbsent[index];
    });

    if (unmarkedStudents.length > 0) {
      const unmarkedRollNumbers = unmarkedStudents
        .map((student) => student.students.rollNumber)
        .join(", ");
      setErrorMessage(
        `Please mark the following students as present or absent: Roll No ${unmarkedRollNumbers}`
      );
      return; // Prevent submission
    }

    // Clear error message if submission is valid
    setErrorMessage(null);
    // Proceed with submission logic
    onSubmit();
  };

  const handleCloseError = () => {
    setErrorMessage(null);
  };
  // const handleCloseError = () => {
  //   setErrorMessage(null);
  // };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded flex justify-between items-center">
          <span>{errorMessage}</span>
          <Button variant="outline" onClick={handleCloseError}>
            Dismiss
          </Button>
        </div>
      )}
      <div className="flex justify-end gap-4">
        {/* <Button variant="outline" onClick={onClearAll}>Clear All</Button> */}
        {/* <Button onClick={handleSubmit}>Submit</Button> */}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 mt-4">
            <TableHead>Roll No</TableHead>
            <TableHead>Enrollment Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Father's Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
         Status
            </TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((studentData, index) => (
            <TableRow
              key={studentData.id}
              className={`${
                studentData.attendanceStatus === "ABSENT"
                  ? " bg-red-100 "
                  : " bg-white "
              }`}
            >
              <TableCell>{studentData.studentRollNumber}</TableCell>
              <TableCell>{studentData.studentEnrollmentNumber}</TableCell>
              <TableCell>{studentData.studentName}</TableCell>
              <TableCell>{studentData.studentFatherName}</TableCell>
              <TableCell>{studentData.studentFatherMail}</TableCell>
              <TableCell>{studentData.attendanceStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
