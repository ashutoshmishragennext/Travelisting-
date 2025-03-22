"use client";
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format, parse, addMonths, differenceInMonths } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interfaces remain the same as in the original code
interface AttendanceRecord {
  phaseName: string;
  subjectName: string;
  batchName: string;
  rollNumber: number;
  enrollmentNumber: string;
  studentName: string;
  date: string;
  yyyyMm: string;
  presentCount: string;
  absentCount: string;
}

interface SubjectAttendance {
  subjectName: string;
  monthlyAttendance: {
    [month: string]: {
      present: number;
      absent: number;
      total: number;
      percentage: string;
    };
  };
  overallAttendance: {
    totalPresent: number;
    totalClasses: number;
    attendancePercentage: string;
  };
}

interface ProcessedStudentAttendance {
  rollNumber: number;
  enrollmentNumber: string;
  studentName: string;
  subjects: SubjectAttendance[];
  totalAttendance?: {
    totalPresent: number;
    totalClasses: number;
    attendancePercentage: string;
  };
}
interface AY {
  id: string;
  academicYear: string;
}
interface AcademicPhase {
  id: string;
  name: string;
  academicYear: number;
}

const Monthly: React.FC = () => {
  const [AY, setAY] = useState<AY[]>([]);
  const [phases, setPhases] = useState<AcademicPhase[]>([]);
  const [selectedAY, setSelectedAY] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [processedStudents, setProcessedStudents] = useState<
    ProcessedStudentAttendance[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFromMonth, setSelectedFromMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [selectedToMonth, setSelectedToMonth] = useState<string>(
    format(addMonths(new Date(), 1), "yyyy-MM")
  );

  useEffect(() => {
    const fetchAY = async () => {
      try {
        const response = await fetch("/api/academicYear");
        const data = await response.json();

        setAY(data);

        // Optionally set the first academic year as default if available
        if (data && data.length > 0) {
          setSelectedAY(data[0].academicYear);
        }

        setProcessedStudents([]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAY();
  }, []);

  // Fetch Academic Phases
  useEffect(() => {
    // Only fetch phases if an academic year is actually selected
    if (selectedAY) {
      const fetchPhases = async () => {
        try {
          const response = await fetch(
            `/api/academicPhase?academicYear=${selectedAY}&orderBy=name,asc`
          );
          if (!response.ok) {
            setProcessedStudents([]);
            throw new Error("Failed to fetch academic phases");
          }

          const data = await response.json();
          if (data && data.length > 0) {
            setPhases(data);
            // Reset phase selection when new academic year is selected
            setProcessedStudents([]);
            setSelectedPhase("");
          } else {
            setPhases([]);
            setProcessedStudents([]);
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
          // Reset phases and processed students on error
          setPhases([]);
          setProcessedStudents([]);
        }
      };

      fetchPhases();
    } else {
      // Reset phases when no academic year is selected
      setPhases([]);
      setProcessedStudents([]);
    }
  }, [selectedAY]);

  const fetchAttendanceReportData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/academicAttendance/attendanceReport2?academicPhaseId=${selectedPhase}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const attendanceData: AttendanceRecord[] = await response.json();
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

  // Generate Month Range
  const generateMonthRange = (fromMonth: string, toMonth: string): string[] => {
    const fromDate = parse(fromMonth, "yyyy-MM", new Date());
    const toDate = parse(toMonth, "yyyy-MM", new Date());

    const monthCount = differenceInMonths(toDate, fromDate) + 1;

    return Array.from({ length: monthCount }, (_, i) =>
      format(addMonths(fromDate, i), "yyyy-MM")
    );
  };

  // Previously defined methods remain the same (fetchAttendanceReportData, generateMonthRange, processAttendanceData, formatMonthYear)
  const processAttendanceData = (
    records: AttendanceRecord[]
  ): ProcessedStudentAttendance[] => {
    const studentMap = new Map<number, ProcessedStudentAttendance>();

    const monthMap: Record<string, string> = Object.fromEntries(
      Array.from({ length: 12 }, (_, index) => [
        new Date(0, index).toLocaleString("default", { month: "long" }),
        format(new Date(new Date().getFullYear(), index), "yyyy-MM"),
      ])
    );
    // // Map to convert month names to yyyy-MM format
    // const monthMap: { [key: string]: string } = {
    //   January: format(new Date(new Date().getFullYear(), 0), "yyyy-MM"),
    //   February: format(new Date(new Date().getFullYear(), 1), "yyyy-MM"),
    //   March: format(new Date(new Date().getFullYear(), 2), "yyyy-MM"),
    //   April: format(new Date(new Date().getFullYear(), 3), "yyyy-MM"),
    //   May: format(new Date(new Date().getFullYear(), 4), "yyyy-MM"),
    //   June: format(new Date(new Date().getFullYear(), 5), "yyyy-MM"),
    //   July: format(new Date(new Date().getFullYear(), 6), "yyyy-MM"),
    //   August: format(new Date(new Date().getFullYear(), 7), "yyyy-MM"),
    //   September: format(new Date(new Date().getFullYear(), 8), "yyyy-MM"),
    //   October: format(new Date(new Date().getFullYear(), 9), "yyyy-MM"),
    //   November: format(new Date(new Date().getFullYear(), 10), "yyyy-MM"),
    //   December: format(new Date(new Date().getFullYear(), 11), "yyyy-MM"),
    // };

    // Generate all months between selected from and to months
    const allMonths = generateMonthRange(selectedFromMonth, selectedToMonth);

    // Group records by roll number and subject
    const groupedRecords = records.reduce((acc, record) => {
      const key = record.rollNumber;
      if (!acc[key]) {
        acc[key] = {};
      }
      if (!acc[key][record.subjectName]) {
        acc[key][record.subjectName] = [];
      }
      acc[key][record.subjectName].push(record);
      return acc;
    }, {} as { [rollNumber: number]: { [subject: string]: AttendanceRecord[] } });

    // Process each student
    Object.entries(groupedRecords).forEach(
      ([rollNumberStr, subjectRecords]) => {
        const rollNumber = parseInt(rollNumberStr);

        // Initialize student entry
        const studentEntry: ProcessedStudentAttendance = {
          rollNumber: rollNumber,
          enrollmentNumber: "",
          studentName: "",
          subjects: [],
        };

        // Process each subject for the student
        Object.entries(subjectRecords).forEach(([subjectName, records]) => {
          const firstRecord = records[0];

          // Update student info from the first record
          if (!studentEntry.enrollmentNumber) {
            studentEntry.enrollmentNumber = firstRecord.enrollmentNumber;
            studentEntry.studentName = firstRecord.studentName;
          }

          // Initialize subject entry
          const subjectEntry: SubjectAttendance = {
            subjectName: subjectName,
            monthlyAttendance: allMonths.reduce((acc, monthKey) => {
              acc[monthKey] = {
                present: 0,
                absent: 0,
                total: 0,
                percentage: "0.00",
              };
              return acc;
            }, {} as SubjectAttendance["monthlyAttendance"]),
            overallAttendance: {
              totalPresent: 0,
              totalClasses: 0,
              attendancePercentage: "0.00",
            },
          };

          // Process monthly attendance for this subject
          records.forEach((record) => {
            const month = monthMap[record.yyyyMm] || record.yyyyMm;

            if (subjectEntry.monthlyAttendance[month]) {
              const present = parseInt(record.presentCount);
              const absent = parseInt(record.absentCount);
              const total = present + absent;

              subjectEntry.monthlyAttendance[month].present += present;
              subjectEntry.monthlyAttendance[month].absent += absent;
              subjectEntry.monthlyAttendance[month].total += total;

              // Calculate monthly percentage
              subjectEntry.monthlyAttendance[month].percentage =
                total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";
            }
          });

          // Calculate overall attendance for this subject
          Object.values(subjectEntry.monthlyAttendance).forEach((monthData) => {
            subjectEntry.overallAttendance.totalPresent += monthData.present;
            subjectEntry.overallAttendance.totalClasses += monthData.total;
          });

          // Calculate overall attendance percentage for this subject
          subjectEntry.overallAttendance.attendancePercentage =
            subjectEntry.overallAttendance.totalClasses > 0
              ? (
                  (subjectEntry.overallAttendance.totalPresent /
                    subjectEntry.overallAttendance.totalClasses) *
                  100
                ).toFixed(2)
              : "0.00";

          studentEntry.subjects.push(subjectEntry);
        });

       

        studentMap.set(rollNumber, studentEntry);
      }
    );

    const processedStudentData = Array.from(studentMap.values()).map(
      (student) => {
        // Calculate total attendance across all subjects
        const totalAttendance = {
          totalPresent: 0,
          totalClasses: 0,
          attendancePercentage: "0.00",
        };

        student.subjects.forEach((subject) => {
          totalAttendance.totalPresent += subject.overallAttendance.totalPresent;
          totalAttendance.totalClasses += subject.overallAttendance.totalClasses;
        });

        // Calculate overall attendance percentage
        totalAttendance.attendancePercentage =
          totalAttendance.totalClasses > 0
            ? (
                (totalAttendance.totalPresent / totalAttendance.totalClasses) *
                100
              ).toFixed(2)
            : "0.00";

        return {
          ...student,
          totalAttendance,
        };
      }
    );

    return processedStudentData;
  };

  // Modified Download CSV method to include more detailed information
  const downloadCSV = () => {
    const monthKeys = generateMonthRange(selectedFromMonth, selectedToMonth);
    const allSubjects = Array.from(
      new Set(
        processedStudents.flatMap((student) =>
          student.subjects.map((subject) => subject.subjectName)
        )
      )
    );

    // Updated headers to include Total column
    const headers = [
      "Roll No",
      "Enrollment No",
      "Student Name",
      ...monthKeys.flatMap((month) =>
        allSubjects.map(
          (subject) => `${formatMonthYear(month)} - ${subject} Attendance`
        )
      ),
      "Total Subjects",
      "Total Overall Presence",
      "Overall Presence %",
      "Total Attendance",
      "Total Attendance %",
    ];

    // Modify rows to include total attendance
    const rows = processedStudents.map((student) => {
      const monthData = monthKeys.flatMap((month) => {
        return allSubjects.map((subjectName) => {
          const subject = student.subjects.find(
            (s) => s.subjectName === subjectName
          );
          const monthAttendance = subject?.monthlyAttendance[month];
          return monthAttendance
            ? `${monthAttendance.present}/${monthAttendance.total} (${monthAttendance.percentage}%)`
            : "0/0 (0.00%)";
        });
      });

      const totalOverallPresence = student.subjects.reduce(
        (sum, subject) => sum + subject.overallAttendance.totalPresent,
        0
      );

      const overallPresencePercentage =
        student.subjects.length > 0
          ? (
              (totalOverallPresence /
                student.subjects.reduce(
                  (sum, subject) =>
                    sum + subject.overallAttendance.totalClasses,
                  0
                )) *
              100
            ).toFixed(2)
          : "0.00";

      return [
        student.rollNumber,
        student.enrollmentNumber,
        student.studentName,
        ...monthData,
        student.subjects.length,
        totalOverallPresence,
        `${overallPresencePercentage}%`,
        student.totalAttendance
          ? `${student.totalAttendance.totalPresent}/${student.totalAttendance.totalClasses}`
          : "0/0",
        student.totalAttendance
          ? `${student.totalAttendance.attendancePercentage}%`
          : "0.00%",
      ];
    });

    // ... [Rest of the downloadCSV method remains the same]
  };
  const formatMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    const monthAbbreviations = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthAbbr = monthAbbreviations[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);

    return `${monthAbbr}-${year}`;
  };
  // Modified Render method to show dynamic columns for subjects and months
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Monthly Attendance Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* From Month Selection */}
          <div className="space-y-1">
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
            <Button onClick={fetchAttendanceReportData} className="w-full">
              Show Attendance Report
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
        {!isLoading && !error && processedStudents.length > 0 && (
        <div className="border border-white rounded-lg overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400 mx-auto">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-300 p-4">Roll No</th>
                <th className="border border-gray-300 p-4">Enrollment No</th>
                <th className="border border-gray-300 p-4">Student Name</th>
                <th className="border border-gray-300 p-4">Subject</th>
                {/* Dynamically generate month columns */}
                {generateMonthRange(selectedFromMonth, selectedToMonth).map(
                  (month) => (
                    <th key={month} className="border border-gray-300 p-4">
                      {formatMonthYear(month)}
                    </th>
                  )
                )}
                <th className="border border-gray-300 p-4">Subject Total</th>
                <th className="border border-gray-300 p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {processedStudents.flatMap((student) => {
                // Get all unique months
                const allMonths = generateMonthRange(
                  selectedFromMonth,
                  selectedToMonth
                );

                // Create a row for each subject of the student
                return student.subjects.map((subject, subjectIndex) => (
                  <tr key={`${student.rollNumber}-${subject.subjectName}`}>
                    {/* Student details with rowspan */}
                    {subjectIndex === 0 && (
                      <>
                        <td
                          className="border border-gray-300 p-4"
                          rowSpan={student.subjects.length}
                        >
                          {student.rollNumber}
                        </td>
                        <td
                          className="border border-gray-300 p-4"
                          rowSpan={student.subjects.length}
                        >
                          {student.enrollmentNumber}
                        </td>
                        <td
                          className="border border-gray-300 p-4"
                          rowSpan={student.subjects.length}
                        >
                          {student.studentName}
                        </td>
                      </>
                    )}

                    {/* Subject Name */}
                    <td className="border border-gray-300 p-4">
                      {subject.subjectName}
                    </td>

                    {/* Monthly Attendance for Each Month */}
                    {allMonths.map((month) => {
                      const monthAttendance =
                        subject.monthlyAttendance[month];
                      return (
                        <td
                          key={`${month}-${subject.subjectName}`}
                          className="border border-gray-300 p-4 text-center"
                        >
                          {monthAttendance
                            ? `${monthAttendance.present}/${monthAttendance.total}`
                            : "0/0"}
                        </td>
                      );
                    })}

                    {/* Subject Total */}
                    <td className="border border-gray-300 p-4 text-center">
                      {`${subject.overallAttendance.totalPresent}/${subject.overallAttendance.totalClasses} (${subject.overallAttendance.attendancePercentage}%)`}
                    </td>

                    {/* Add Total column for the first subject row */}
                    {subjectIndex === 0 && (
                      <td
                        className="border border-gray-300 p-4 text-center"
                        rowSpan={student.subjects.length}
                      >
                        {student.totalAttendance
                          ? `${student.totalAttendance.totalPresent}/${student.totalAttendance.totalClasses} (${student.totalAttendance.attendancePercentage}%)`
                          : "0/0 (0.00%)"}
                      </td>
                    )}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}

        {/* Download Button */}
        {!isLoading && !error && processedStudents.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Button onClick={downloadCSV} className="w-full md:w-auto">
              Download Attendance Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Monthly;
