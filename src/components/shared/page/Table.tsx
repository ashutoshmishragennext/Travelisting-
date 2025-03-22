import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Type definitions for the attendance record
interface AttendanceRecord {
  phaseName: string;
  subjectName: string;
  batchName: string;
  rollNumber: number;
  enrollmentNumber:string;
  studentName: string;
  date: string;
  presentCount: string;
  absentCount: string;
  yyyyMm?: string;
}

// Type for processed student attendance
interface ProcessedStudentAttendance {
  rollNumber: number;
  enrollmentNumber: string; // Add this line
  attendance: {
    [date: string]: {
      presentCount: number;
      totalLectures: number;
    }
  };
}

// Props type for the AttendanceTable component
interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ attendanceData }) => {
  // Group attendance data by student and date
  const processedAttendance = useMemo(() => {
    const studentAttendance: { [studentName: string]: ProcessedStudentAttendance } = {};
    
    // Process attendance for each student
    attendanceData.forEach(entry => {
      if (!studentAttendance[entry.studentName]) {
        studentAttendance[entry.studentName] = {
          rollNumber: entry.rollNumber,
          enrollmentNumber: entry.enrollmentNumber, // Add this line
          attendance: {}
        };
      }
      
      studentAttendance[entry.studentName].attendance[entry.date] = {
        presentCount: parseInt(entry.presentCount),
        totalLectures: parseInt(entry.presentCount) + parseInt(entry.absentCount)
      };
    });

    // Convert to sorted array
    return Object.entries(studentAttendance)
      .sort((a, b) => a[1].rollNumber - b[1].rollNumber);
  }, [attendanceData]);

  // Rest of the code remains the same as in your original implementation
  // Get unique dates sorted
  const uniqueDates = useMemo(() => {
    return Array.from(new Set(attendanceData.map(entry => entry.date)))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [attendanceData]);

  // Calculate total lectures for the entire period
  const totalLecturesPerDay = useMemo(() => {
    return uniqueDates.map(date => {
      const dayEntries = attendanceData.filter(entry => entry.date === date);
      // Assume first entry represents total lectures for the day
      return dayEntries[0] 
        ? parseInt(dayEntries[0].presentCount) + parseInt(dayEntries[0].absentCount)
        : 0;
    });
  }, [attendanceData]);

  // Calculate attendance percentage for each student
  const calculateAttendancePercentage = (attendance: ProcessedStudentAttendance['attendance']): string => {
    const presentLectures = Object.values(attendance).reduce((sum, entry) => sum + entry.presentCount, 0);
    const totalLectures = Object.values(attendance).reduce((sum, entry) => sum + entry.totalLectures, 0);
    return totalLectures > 0 
      ? ((presentLectures / totalLectures) * 100).toFixed(2) 
      : "0.00";
  };

  return (
    <Card className="w-full overflow-x-auto">
      <CardHeader>
        {/* <CardTitle>Student Attendance Table</CardTitle> */}
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 sticky left-0 bg-gray-100 z-10">Roll No</th>
              <th className="border p-2 sticky left-0 bg-gray-100 z-10">Enrollment Number</th>
              <th className="border p-2 sticky left-0 bg-gray-100 z-10">Student</th>
            
              {uniqueDates.map((date, index) => (
                <th key={date} className="border p-2">
                  <div>{new Date(date).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}</div>
                  <div className="text-xs text-gray-600">
                    Lectures: {totalLecturesPerDay[index]}
                  </div>
                </th>
              ))}
              <th className="border p-2">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {processedAttendance.map(([studentName, data]) => (
              <tr key={studentName} className="hover:bg-gray-50">
                <td className="border p-2 sticky left-0 bg-white">
                  {data.rollNumber}
                </td>
                <td className="border p-2 sticky left-0 bg-white">
                  {data.enrollmentNumber}
                </td>
                
                <td className="border p-2 font-medium sticky left-0 bg-white">
                  {studentName}
                </td>
              
                {uniqueDates.map(date => {
                  const dayAttendance = data.attendance[date] || { presentCount: 0, totalLectures: 0 };
                  return (
                    <td 
                      key={date} 
                      className={`border p-2 text-center ${
                        dayAttendance.presentCount > 0 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}
                    >
                      {dayAttendance.presentCount}/{dayAttendance.totalLectures}
                    </td>
                  );
                })}
                <td className="border p-2 text-center font-bold">
                  {calculateAttendancePercentage(data.attendance)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;