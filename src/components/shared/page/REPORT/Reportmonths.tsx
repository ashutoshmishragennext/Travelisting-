"use client"
import React, { useState, useEffect } from "react"
import { saveAs } from 'file-saver'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { format, parse, eachDayOfInterval, parseISO } from "date-fns"
import AttendanceTable from "../Table"
import { StringDecoder } from "string_decoder"

// Interfaces
interface AcademicPhase {
  id: string
  name: string
  academicYear: number
}
interface AY {
  id: string;
  academicYear: string;
}

interface AcademicSubject {
  academic_phase_subjects: {
    id: string
    academicPhaseId: string
    subjectMasterId: string
    creditHours: number | null
    isCompulsory: boolean
  }
  subject_masters: {
    id: string
    name: string
    code: string
    description: string
    totalCreditHours: number
    isActive: boolean
  }
}

interface AttendanceReportRecord {
  phaseName: string
  subjectName: string
  batchName: string
  rollNumber: number
  enrollmentNumber: string
  studentName: string
  date: string
  presentCount: string
  absentCount: string
}
interface Batch {
    batchId: string;
    batchName: string;
    capacity: string;
  }

interface ProcessedStudentAttendance {
  rollNumber: number
  studentName: string
  dailyAttendance: {
    [date: string]: {
      present: number
      absent: number
    }
  }
}

const DynamicAttendanceReport: React.FC = () => {
  const [AY, setAY] = useState<AY[]>([]);
  const [selectedAY, setSelectedAY] = useState<string>("");
  const [phases, setPhases] = useState<AcademicPhase[]>([])
  const [subjects, setSubjects] = useState<AcademicSubject[]>([])
  const [selectedPhase, setSelectedPhase] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceReportRecord[]>([])
  const [processedStudents, setProcessedStudents] = useState<ProcessedStudentAttendance[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [batches, setBatches] = useState<Batch[]>([]);

  
  
  // Date inputs
  const [selectedFromDate, setSelectedFromDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [selectedToDate, setSelectedToDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [dateRange, setDateRange] = useState<string[]>([])

 


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
      
        setSubjects([])
        setBatches([])
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
          const response = await fetch(`/api/academicPhase?academicYear=${selectedAY}&orderBy=name,asc`);
          if (!response.ok) {
            setProcessedStudents([]);
            throw new Error("Failed to fetch academic phases");
          }
          const data = await response.json();
          setBatches([])
          if (data && data.length > 0) {
            setPhases(data);
            // Reset phase selection when new academic year is selected
            setSelectedPhase("");
          } else {
            setBatches([])
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

  // Fetch Subjects when Phase is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedPhase) return

      try {
        const response = await fetch(`/api/academicSubject?academicPhaseId=${selectedPhase}`)
       
        if (!response.ok) {
          throw new Error('Failed to fetch academic subjects')
        }
        const data = await response.json()
        setSubjects(data)
        
        // Reset subject selection when phase changes
        setSelectedSubject("")
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    }

    fetchSubjects()
  }, [selectedPhase])

  useEffect(() => {
    const fetchBatches = async () => {
      if (!selectedSubject) return;
      try {
        const response = await fetch(
          `/api/batchAssignment?phaseId=${selectedPhase}`
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

  // Generate Date Range
  useEffect(() => {
    const from = parseISO(selectedFromDate)
    const to = parseISO(selectedToDate)
    
    const dates = eachDayOfInterval({ start: from, end: to })
      .map(date => format(date, 'yyyy-MM-dd'))
    
    setDateRange(dates)
  }, [selectedFromDate, selectedToDate])

  // Fetch Attendance Report Data
  const fetchAttendanceReportData = async () => {
    if (!selectedPhase || !selectedSubject || !selectedFromDate || !selectedToDate) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/academicAttendance/attendanceReport2?academicPhaseId=${selectedPhase}&academicSubjectId=${selectedSubject}&batchId=${selectedBatch}&fromDate=${selectedFromDate}&toDate=${selectedToDate}`)
                                    // api/academicAttendance/attendanceReport2?academicPhaseId=b8562f5f-e844-4d66-8205-2e78327aead7&academicSubjectId=0ff0d00f-65ec-4daa-aad2-57de8f5a9f3c&batchId=0a40ae9e-f26a-4756-89fa-f53c38456266&fromDate=2024-01-01&toDate=2024-11-30
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data')
      }

      const attendanceData: AttendanceReportRecord[] = await response.json()
      setAttendanceRecords(attendanceData)
      console.log("Data from backend",attendanceData);

      // Process attendance data
      const processedStudentData = processAttendanceData(attendanceData)
     
      
      setProcessedStudents(processedStudentData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Process Attendance Data
  const processAttendanceData = (records: AttendanceReportRecord[]): ProcessedStudentAttendance[] => {
    const studentMap = new Map<number, ProcessedStudentAttendance>()
    
    // First, create entries for all students with empty dates
    const from = parseISO(selectedFromDate)
    const to = parseISO(selectedToDate)
    const allDates = eachDayOfInterval({ start: from, end: to })
      .map(date => format(date, 'yyyy-MM-dd'))

    records.forEach(record => {
      if (!studentMap.has(record.rollNumber)) {
        const emptyDailyAttendance = allDates.reduce((acc, date) => {
          acc[date] = { present: 0, absent: 0 }
          return acc
        }, {} as { [date: string]: { present: number, absent: number } })

        studentMap.set(record.rollNumber, {
          rollNumber: record.rollNumber,
          studentName: record.studentName,
          dailyAttendance: emptyDailyAttendance
        })
      }
    })

    // Then process actual attendance records
    records.forEach(record => {
      const student = studentMap.get(record.rollNumber)!
      
      if (student.dailyAttendance[record.date]) {
        student.dailyAttendance[record.date].present += parseInt(record.presentCount)
        student.dailyAttendance[record.date].absent += parseInt(record.absentCount)
      }
    })

    return Array.from(studentMap.values())
  }

  // Calculate Attendance for Period
  const calculateAttendanceForPeriod = (student: ProcessedStudentAttendance) => {
    let totalPresent = 0
    let totalClasses = 0

    Object.values(student.dailyAttendance).forEach(dayData => {
      totalPresent += dayData.present
      totalClasses += dayData.present + dayData.absent
    })

    const attendancePercentage = totalClasses > 0 
      ? ((totalPresent / totalClasses) * 100).toFixed(2) 
      : '0.00'

    return { totalPresent, totalClasses, attendancePercentage }
  }

  // Download CSV method
  const downloadCSV = () => {
    const headers = [
      'Roll No', 
      'Student Name', 
      ...dateRange,
      'Total Classes',
      'Total Presence', 
      'Presence %'
    ]
    
    const rows = processedStudents.map((student) => {
      const { totalPresent, totalClasses, attendancePercentage } = calculateAttendanceForPeriod(student)
      
      const dailyData = dateRange.map(date => 
        student.dailyAttendance[date]?.present || 0
      )

      return [
        student.rollNumber,
        student.studentName,
        ...dailyData,
        totalClasses,
        totalPresent,
        attendancePercentage
      ]
    })
  
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'daily_attendance_report.csv')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Attendance Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          {/* Phase Selection */}
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
              Select Phase <span className="text-red-500">*</span>
            </label>
            <Select 
              value={selectedPhase} 
              onValueChange={setSelectedPhase}
              disabled={!selectedAY}
            >
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

         

          {/* Subject Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Select Subject <span className="text-red-500">*</span>
            </label>
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
              disabled={!selectedPhase}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem 
                    key={subject.academic_phase_subjects.id} 
                    value={subject.academic_phase_subjects.id}
                  >
                    {subject.subject_masters.name} ({subject.subject_masters.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Select Batch <span className="text-red-500">*</span>
            </label>
            <Select value={selectedBatch} onValueChange={setSelectedBatch} disabled={!selectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(batches) && batches.length > 0 ? (
                  batches.map((batch) => (
                    <SelectItem key={batch.batchId} value={batch.batchId}  >
                      {batch.batchName}
                    </SelectItem>
                  ))
                ) : (
                  <div>No Batches</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* From Date Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              From Date <span className="text-red-500">*</span>
            </label>
            <Input 
              type="date" 
              value={selectedFromDate}
              onChange={(e) => setSelectedFromDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* To Date Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              To Date <span className="text-red-500">*</span>
            </label>
            <Input 
              type="date" 
              value={selectedToDate}
              onChange={(e) => setSelectedToDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button 
              onClick={fetchAttendanceReportData} 
              disabled={!selectedPhase || !selectedSubject || !selectedFromDate || !selectedToDate}
              className="w-full"
            >
              Search Attendance
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

        {error && (
          <div className="text-red-500 text-center mb-4">
            <h1>No attendance Record exists for the specify criteria</h1>
        
          </div>
        )}

        {/* Attendance Table */}
        {!error && !isLoading && processedStudents.length > 0 && (
        // <div className="border border-white rounded-lg overflow-x-auto">
        //   <table className="w-full border-collapse border border-gray-400 mx-auto overflow-scroll">
        //     {/* <thead>
        //       <tr className="bg-gray-700">
        //         <th className="border border-gray-300 text-left p-4 text-white">
        //           Roll No
        //         </th>
        //         <th className="border border-gray-300 text-left p-4 text-white">
        //           Student Name
        //         </th>
        //         {generateMonthRange(selectedFromDate, selectedToDate).map((month, index) => (
        //           <th
        //             key={index}
        //             className="border border-gray-300 text-left p-4 text-white"
        //           >
        //             {month}
        //           </th>
        //         ))}
        //         <th className="border border-gray-300 text-left p-4 text-white">
        //           Total Classes
        //         </th>
        //         <th className="border border-gray-300 text-left p-4 text-white">
        //           Total Presence
        //         </th>
        //         <th className="border border-gray-300 text-left p-4 text-white">
        //           Presence %
        //         </th>
        //       </tr>
        //     </thead> */}
        //     <thead>
        //       <tr className="bg-gray-700">
        //         <th className="border border-gray-300 text-left p-4 text-white sticky left-0 bg-gray-700">
        //           Roll No
        //         </th>
        //         <th className="border border-gray-300 text-left p-4 text-white sticky left-0 bg-gray-700">
        //           Student Name
        //         </th>
        //         {dateRange.map((date, index) => (
        //           <th
        //             key={index}
        //             className="border border-gray-300 text-left p-4 text-white"
        //           >
        //             {format(parseISO(date), 'dd MMM')}
        //           </th>
        //         ))}
        //         <th className="border border-gray-300 text-left p-4 text-white sticky right-0 bg-gray-700">
        //           Total Classes
        //         </th>
        //         <th className="border border-gray-300 text-left p-4 text-white sticky right-0 bg-gray-700">
        //           Total Presence
        //         </th>
        //         <th className="border border-gray-300 text-left p-4 text-white sticky right-0 bg-gray-700">
        //           Presence %
        //         </th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //     {processedStudents.map((student, index) => {
        //         const { totalPresent, totalClasses, attendancePercentage } = calculateAttendanceForPeriod(student);
                
        //         return (
        //           <tr key={student.rollNumber} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
        //             <td className="border border-gray-300 p-4 text-white">{student.rollNumber}</td>
        //             <td className="border border-gray-300 p-4 text-white">{student.studentName}</td>
        //             {dateRange.map((date, dateIndex) => {
        //               const dayData = student.dailyAttendance[date];
        //               return (
        //                 <td 
        //                   key={dateIndex} 
        //                   className="border border-gray-300 p-4 text-white text-center"
        //                 >
        //                   {dayData ? dayData.present : 0}
        //                 </td>
        //               );
        //             })}
        //             <td className="border border-gray-300 p-4 text-white">{totalClasses}</td>
        //             <td className="border border-gray-300 p-4 text-white">{totalPresent}</td>
        //             <td className="border border-gray-300 p-4 text-white">{attendancePercentage}</td>
        //           </tr>
        //         );
        //       })}
        //     </tbody>
        //   </table>

        //   <div className="flex justify-center my-5">
        //     <Button onClick={downloadCSV} variant="default">
        //       Download Report
        //     </Button>
        //   </div>
        // </div>
        <AttendanceTable attendanceData={attendanceRecords} />
        )}

{/* {!isLoading && processedStudents.length === 0   && (
          <div className="text-center text-gray-500">
            No attendance data available for the selected phase, subject, and month range.
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}

export default DynamicAttendanceReport