"use client";
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format, parse, addMonths, differenceInMonths } from "date-fns";
import { strict } from "assert";

// Interfaces for type safety
interface AcademicPhase {
  id: string;
  name: string;
  academicYear: number;
}
interface AY {
  id: string;
  academicYear: string;
}

interface AcademicSubject {
  academic_phase_subjects: {
    id: string;
    academicPhaseId: string;
    subjectMasterId: string;
    creditHours: number | null;
    isCompulsory: boolean;
  };
  subject_masters: {
    id: string;
    name: string;
    code: string;
    description: string;
    totalCreditHours: number;
    isActive: boolean;
  };
}

// New interface for the attendance report
interface AttendanceReportRecord {
  phaseName: string;
  subjectName: string;
  batchName: string;
  rollNumber: number;
  enrollmentNumber: string
  studentName: string;
  date: string;
  yyyyMm: string;
  presentCount: string;
  absentCount: string;
}
interface Batch {
  batchId: string;
  batchName: string;
  capacity: string;
}

// Interface to aggregate attendance by student
interface ProcessedStudentAttendance {
  rollNumber: number;
  enrollmentNumber: string;
  studentName: string;
  monthlyAttendance: {
    [month: string]: {
      present: number;
      absent: number;
      total: number;
    };
  };
}

const Monthly: React.FC = () => {
  const [AY, setAY] = useState<AY[]>([]);
  const [phases, setPhases] = useState<AcademicPhase[]>([]);
  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
  const [selectedAY, setSelectedAY] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceReportRecord[]
  >([]);
  const [processedStudents, setProcessedStudents] = useState<
    ProcessedStudentAttendance[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [selectedFromMonth, setSelectedFromMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [selectedToMonth, setSelectedToMonth] = useState<string>(
    format(addMonths(new Date(), 1), "yyyy-MM")
  );

  useEffect(() => {
   
    setError(null);

    const fetchAY = async () => {
      try {
        const response = await fetch("/api/academicYear");
        const data = await response.json();
       
           setAY(data)
         
        // setSelectedAY("")

        setSelectedPhase("");
        setSelectedSubject("");
        setSelectedBatch("");
       
        setSubjects([]);
        setBatches([]);
      } catch (error) {
       
        console.error(error);
      }
    };
    fetchAY();
  }, [selectedAY]);
  // Fetch Academic Phases
  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await fetch(`/api/academicPhase?academicYear=${selectedAY}`);
        if (!response.ok) {
          throw new Error("Failed to fetch academic phases");
        }
        const data = await response.json();
        setPhases(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchPhases();
  }, [selectedAY]);

  // Fetch Subjects when Phase is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedPhase) return;

      try {
        const response = await fetch(
          `/api/academicSubject?academicPhaseId=${selectedPhase}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch academic subjects");
        }
        const data = await response.json();
        setSubjects(data);
        console.log("data", data);

        // Reset subject selection when phase changes
        setSelectedSubject("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchSubjects();
  }, [selectedPhase]);

  useEffect(() => {
    const fetchBatches = async () => {
      if (!selectedSubject) return;
      try {
        const response = await fetch(
          `/api/batchAssignment?subjectId=${selectedSubject}`
        );
        const data = await response.json();
        console.log("subject batch", data);

        const batches = data.batches;

        setBatches(batches);
        setSelectedBatch("");
      } catch (error) {
        // toast.error("Failed to load batches");
        console.error(error);
      }
    };
    fetchBatches();
  }, [selectedSubject]);

  // Fetch Attendance Report Data
  const fetchAttendanceReportData = async () => {
    if (
      !selectedPhase ||
      !selectedSubject ||
      !selectedFromMonth ||
      !selectedToMonth
    )
      return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/academicAttendance/attendanceReport2?academicPhaseId=${selectedPhase}&academicSubjectId=${selectedSubject}&batchId=${selectedBatch}&fromMonth=${selectedFromMonth}&toMonth=${selectedToMonth}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const attendanceData: AttendanceReportRecord[] = await response.json();
      console.log("data",attendanceData);
      
      setAttendanceRecords(attendanceData);

      // Process attendance data
      const processedStudentData = processAttendanceData(attendanceData);
      setProcessedStudents(processedStudentData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonthRange = (fromMonth: string, toMonth: string): string[] => {
    const fromDate = parse(fromMonth, "yyyy-MM", new Date());
    const toDate = parse(toMonth, "yyyy-MM", new Date());

    const monthCount = differenceInMonths(toDate, fromDate) + 1;

    return Array.from({ length: monthCount }, (_, i) =>
      format(addMonths(fromDate, i), "yyyy-MM")
    );
  };

  // Process Attendance Data
  const processAttendanceData = (
    records: AttendanceReportRecord[]
  ): ProcessedStudentAttendance[] => {
    const studentMap = new Map<number, ProcessedStudentAttendance>();

    // Map to convert month names to yyyy-MM format
    const monthMap: { [key: string]: string } = {
      January: format(new Date(new Date().getFullYear(), 0), "yyyy-MM"),
      February: format(new Date(new Date().getFullYear(), 1), "yyyy-MM"),
      March: format(new Date(new Date().getFullYear(), 2), "yyyy-MM"),
      April: format(new Date(new Date().getFullYear(), 3), "yyyy-MM"),
      May: format(new Date(new Date().getFullYear(), 4), "yyyy-MM"),
      June: format(new Date(new Date().getFullYear(), 5), "yyyy-MM"),
      July: format(new Date(new Date().getFullYear(), 6), "yyyy-MM"),
      August: format(new Date(new Date().getFullYear(), 7), "yyyy-MM"),
      September: format(new Date(new Date().getFullYear(), 8), "yyyy-MM"),
      October: format(new Date(new Date().getFullYear(), 9), "yyyy-MM"),
      November: format(new Date(new Date().getFullYear(), 10), "yyyy-MM"),
      December: format(new Date(new Date().getFullYear(), 11), "yyyy-MM"),
    };
    

    // Generate all months between selected from and to months
    const allMonths = generateMonthRange(selectedFromMonth, selectedToMonth);

    // First, create entries for all students with empty months
    records.forEach((record) => {
      const month = monthMap[record.yyyyMm] || record.yyyyMm;

      if (!studentMap.has(record.rollNumber)) {
        const emptyMonthlyAttendance = allMonths.reduce((acc, monthKey) => {
          acc[monthKey] = { present: 0, absent: 0, total: 0 };
          return acc;
        }, {} as { [month: string]: { present: number; absent: number; total: number } });

        studentMap.set(record.rollNumber, {
          
          rollNumber: record.rollNumber,
          enrollmentNumber:record.enrollmentNumber,
          studentName: record.studentName,
          monthlyAttendance: emptyMonthlyAttendance,
        });
      }
    });

    // Then process actual attendance records
    records.forEach((record) => {
      const month = monthMap[record.yyyyMm] || record.yyyyMm;
      const student = studentMap.get(record.rollNumber)!;

      // Ensure the month exists in monthlyAttendance
      if (!student.monthlyAttendance[month]) {
        student.monthlyAttendance[month] = { present: 0, absent: 0, total: 0 };
      }

      student.monthlyAttendance[month].present += parseInt(record.presentCount);
      student.monthlyAttendance[month].absent += parseInt(record.absentCount);
      student.monthlyAttendance[month].total +=
        parseInt(record.presentCount) + parseInt(record.absentCount);
    });

    return Array.from(studentMap.values());
  };

  // Calculate Attendance for Period
  const calculateAttendanceForPeriod = (
    student: ProcessedStudentAttendance
  ) => {
    let totalPresent = 0;
    let totalClasses = 0;

    Object.values(student.monthlyAttendance).forEach((monthData) => {
      totalPresent += monthData.present;
      totalClasses += monthData.total;
    });

    const attendancePercentage =
      totalClasses > 0
        ? ((totalPresent / totalClasses) * 100).toFixed(2)
        : "0.00";

    return { totalPresent, totalClasses, attendancePercentage };
  };

  // Download CSV method
  const downloadCSV = () => {
    const monthKeys = Object.keys(
      processedStudents[0]?.monthlyAttendance || {}
    ).sort();

    const headers = [
      "Roll No",
      "Student Name",
      ...monthKeys,
      "Total Classes",
      "Total Presence",
      "Presence %",
    ];

    const rows = processedStudents.map((student) => {
      const { totalPresent, totalClasses, attendancePercentage } =
        calculateAttendanceForPeriod(student);

      const monthData = monthKeys.map(
        (month) => student.monthlyAttendance[month]?.present || 0
      );

      return [
        student.rollNumber,
        student.studentName,
        ...monthData,
        totalClasses,
        totalPresent,
        attendancePercentage,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "attendance_report.csv");
  };

  const formatMonthYear = (dateString: string): string => {
    // Create a Date object from the input string
    const date = new Date(dateString);
    
    // Array of month abbreviations
    const monthAbbreviations = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Get month abbreviation and two-digit year
    const monthAbbr = monthAbbreviations[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    
    // Return formatted string
    return `${monthAbbr}-${year}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Academic Attendance Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          {/* Phase Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Ay <span className="text-red-500">*</span>
            </label>
            <Select value={selectedAY} onValueChange={setSelectedAY}>
              <SelectTrigger>
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {AY &&
                  AY.map((AY) => (
                    <SelectItem key={AY.id} value={AY.academicYear}>
                      {AY.academicYear}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Academic Phase <span className="text-red-500">*</span>
            </label>
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Select Phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((phase) => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Academic Subject Dropdown */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Select Subject <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={!selectedPhase}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem
                    key={subject.academic_phase_subjects.id}
                    value={subject.academic_phase_subjects.id}
                  >
                    {subject.subject_masters.name} (
                    {subject.subject_masters.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Select Batch <span className="text-red-500">*</span>
            </label>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(batches) && batches.length > 0 ? (
                  batches.map((batch) => (
                    <SelectItem key={batch.batchId} value={batch.batchId}>
                      {batch.batchName}
                    </SelectItem>
                  ))
                ) : (
                  <div>No Batches</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* From Month Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              From Month <span className="text-red-500">*</span>
            </label>
            <Input
              type="month"
              value={selectedFromMonth}
              onChange={(e) => setSelectedFromMonth(e.target.value)}
              className="w-full"
            />
          </div>

          {/* To Month Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              To Month <span className="text-red-500">*</span>
            </label>
            <Input
              type="month"
              value={selectedToMonth}
              onChange={(e) => setSelectedToMonth(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              onClick={fetchAttendanceReportData}
              disabled={
                !selectedPhase ||
                !selectedSubject ||
                !selectedFromMonth ||
                !selectedToMonth
              }
              className="w-full"
            >
              Show
            </Button>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <p>Loading attendance data...</p>
          </div>
        )}

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Attendance Table */}
        {!isLoading && processedStudents.length > 0 && (
          <div className="border border-white rounded-lg overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 mx-auto overflow-scroll">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-300 text-left p-4 text-white">
                    Roll No
                  </th>
                  <th className="border border-gray-300 text-left p-4 text-white">
                  Enrollment Number
                  </th>
                  
                  <th className="border border-gray-300 text-left p-4 text-white">
                    Student Name
                  </th>
                  {generateMonthRange(selectedFromMonth, selectedToMonth).map(
                    (month, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 text-left p-4 text-white"
                      >
                        {formatMonthYear(month)}
                      </th>
                    )
                  )}
                  <th className="border border-gray-300 text-left p-4 text-white">
                    Total Classes
                  </th>
                  <th className="border border-gray-300 text-left p-4 text-white">
                    Total Presence
                  </th>
                  <th className="border border-gray-300 text-left p-4 text-white">
                    Presence %
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedStudents.map((student, index) => {
                  const { totalPresent, totalClasses, attendancePercentage } =
                    calculateAttendanceForPeriod(student);

                  return (
                    <tr key={student.rollNumber}>
                      <td className="border border-gray-300 p-4 ">
                        {student.rollNumber}
                      </td>
                      <td className="border border-gray-300 p-4 ">
                        {student.enrollmentNumber}
                      </td>
                     
                      <td className="border border-gray-300 p-4 ">
                        {student.studentName}
                      </td>
                      {generateMonthRange(
                        selectedFromMonth,
                        selectedToMonth
                      ).map((month, monthIndex) => {
                        const monthData = student.monthlyAttendance[month];
                        return (
                          <td
                            key={monthIndex}
                            className="border border-gray-300 p-4 "
                          >
                            {monthData ? monthData.present : 0}
                          </td>
                        );
                      })}
                      <td className="border border-gray-300 p-4 ">
                        {totalClasses}
                      </td>
                      <td className="border border-gray-300 p-4 ">
                        {totalPresent}
                      </td>
                      <td className="border border-gray-300 p-4 ">
                        {attendancePercentage}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-center my-5">
              <Button onClick={downloadCSV} variant="default">
                Download Report
              </Button>
            </div>
          </div>
        )}

        {!isLoading &&
          processedStudents.length === 0 &&
          selectedPhase &&
          selectedSubject &&
          selectedFromMonth &&
          selectedToMonth && (
            <div className="text-center text-gray-500">
              No attendance data available for the selected phase, subject, and
              month range.
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default Monthly;
