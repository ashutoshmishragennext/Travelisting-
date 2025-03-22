"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";

import { TimeRangePicker } from "@/components/TimeRangePicker";
// import { AttendanceTable } from "@/components/AttendanceTable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "../Date";
import { useCurrentUser } from "@/hooks/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { AttendanceTable } from "@/components/TransferTable";
import { PreviewModal } from "@/components/StudentTransferDilog";
import { getNextAcademicYear } from "@/lib/incrementYear";
import { Check } from "lucide-react";

interface AttendanceData {
  attendanceId: string;
  studentId: string;
  studentName: string;
  studentRollNumber: number;
  studentFatherName: string;
  studentAdmissionYear: number;
  attendanceDate: string;
  attendanceStatus: string;
  markedBy: string;
  academicPhaseId: string;
  academicPhaseName: string;
  academicYear: number;
  batchId: string;
  batchName: string;
  batchCapacity: number;
}

// Type Definitions
interface Phase {
  id: string;
  name: string;
}
interface AY {
  id: string;
  academicYear: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
}

interface Batch {
  batchId: string;
  batchName: string;
  capacity: string;
}

interface StudentData {
  student_subject_batches: {
    id: string;
    studentId: string;
    subjectBatchId: string;
    enrollmentDate: string;
    status: string;
  };

  id: string;
  rollNumber: string;
  enrollmentNumber: string;
  studentName: string;
  fatherName: string;
  fatherEmail: string;
  phaseName: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

interface PreviewData {
  presentStudents: any;
  absentStudents: any;
  subject: string;
  attendanceDate: string;
}

function parseAcademicData(dataArray: any[]) {
  return dataArray.map(
    (data: {
      academic_phases: any;
      subject_masters: any;
      academic_phase_subjects: any;
    }) => {
      const academicPhase = data.academic_phases;
      const subjectMaster = data.subject_masters;
      const academicPhaseSubject = data.academic_phase_subjects;

      return {
        academicPhaseId: academicPhase.id,
        academicPhaseName: academicPhase.name,
        // academicYear: academicPhase.academicYear,
        // startDate: new Date(academicPhase.startDate).toLocaleDateString(),
        // endDate: new Date(academicPhase.endDate).toLocaleDateString(),
        // isActive: academicPhase.isActive,
        subjectId: academicPhaseSubject.id,
        subjectName: subjectMaster.name,
        subjectCode: subjectMaster.code,
        subjectDescription: subjectMaster.description,
      };
    }
  );
}

export default function TransferPage() {
  const [AY, setAY] = useState<AY[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [nextPhases, setNextPhases] = useState<Phase[]>([]);
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Selected values
  const [selectedAY, setSelectedAY] = useState<string>("");
  const [selectedNextPhase, setSelectedNextPhase] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<Date>(new Date());

  const [timeSlot, setTimeSlot] = useState<TimeSlot>({ start: "", end: "" });

  // Students and attendance state
  const [students, setStudents] = useState<StudentData[]>([]);
  const [attendence, setAttendence] = useState<AttendanceData[]>([]);

  const [checkedStudents, setCheckedStudents] = useState<boolean[]>([]);
  const [markAbsent, setMarkAbsent] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [Messege, setMessege] = useState<string | null>(null);

  // Modal state
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [previewData, setPreviewData] = useState<PreviewData>({
    absentStudents: [],
    presentStudents: [],
    subject: "",
    attendanceDate: "",
  });

  const nextAcademicYear = getNextAcademicYear(selectedAY);

  const date = moment(attendanceDate).format("YYYY-MM-DD");
  // const dateYYYY = `${moment(attendanceDate).format("YYYY")}-25`;
  // console.log("dateYYYYYYYY",dateYYYY);

  console.log("preview", previewData);

  const user = useCurrentUser();

  useEffect(() => {
    setMessege(null);
    setError(null);

    const fetchAY = async () => {
      try {
        const response = await fetch("/api/academicYear?orderBy=academicYear,asc");
        const data = await response.json();
        data.length
          ? setAY(data)
          : setError("Please Request admin to create Academic year ");
        // setSelectedAY("")
        if (data && data.length > 0) {
          setSelectedAY(data[0].academicYear);
        }
        setSelectedPhase("");

        setStudents([]);
      } catch (error) {
        toast.error("Failed to load Academic Year");
        console.error(error);
      }
    };
    fetchAY();
  }, []);

  // Fetch phases on component mount
  useEffect(() => {
    if (!selectedAY) {
      return;
    }
    if(!nextAcademicYear){
      setError("next academic Year are not Coming")
      return;
    }
    setMessege(null);
    setError(null);

    const fetchPhases = async () => {
      try {
        const response = await fetch(
          `/api/academicPhase?academicYear=${selectedAY}&orderBy=name,asc`
        );
        const data: Phase[] = await response.json();

        const response2 = await fetch(
          `/api/academicPhase?academicYear=${nextAcademicYear}&orderBy=name,asc`
        );
        const data1: Phase[] = await response2.json();
       

        setStudents([]);
        if (data.length &&  data1.length) {
          setNextPhases(data1)
          setPhases(data);
        } else {
          setError(
            "Please Request admin to create Phases for this Academic year "
          );
        }


      } catch (error) {
        toast.error("Failed to load phases");
        console.error(error);
      }
    };
    fetchPhases();
  }, [selectedAY]);


  // Fetch subjects when phase is selected

  // Fetch batches when subject is selected

  // Fetch students when batch is selected
  useEffect(() => {
    setError(null);
    setMessege(null);
    if (!selectedPhase) {
      // setError("Selecte Batch")
      return;
    }
    // const attendance = async () => {
    // try {
    // if (
    //   selectedAY &&
    //   selectedPhase &&
    //   selectedSubject &&
    //   selectedBatch &&

    //   date &&
    //   timeSlot
    // ) {

    // check if attendance is already marked for this date and time slot
    //   const response = await fetch(
    //     `/api/academicAttendance?batchId=${selectedBatch}&date=${date}&fromTime=${timeSlot.start}:00&toTime=${timeSlot.end}:00`
    //     ///api/academicAttendance?academicPhaseId=b8562f5f-e844-4d66-8205-2e78327aead7&academicSubjectId=0ff0d00f-65ec-4daa-aad2-57de8f5a9f3c&batchId=a34454c3-b226-425d-a151-5a847368dbe1&date=2024-11-28&fromTime=13:15:00&toTime=14:15:00
    //   );

    //   const data = await response.json();

    //   if (data) {
    //     // console.log("response",response.json());

    //     setError("Attendance has already submitted for this period");
    //   } else {
    //     console.log("fetch student");

    //     fetchStudents();
    //   }
    //   // }else{
    //   //   setError("Select all of the above fields")
    //   //   return;
    //   // }
    // } catch (error) {
    //   toast.error("Failed to load students");
    //   console.error(error);
    // }
    // };

    const fetchStudents = async () => {
      setMessege(null);
      setError(null);

      try {
        const response = await fetch(
          `/api/student?currentPhaseId=${selectedPhase}&orderBy=studentName,asc`
        );
        const data = await response.json();
        setStudents(data);
        console.log("student data", data);
        setCheckedStudents(new Array(data.length).fill(true));
        setMarkAbsent(new Array(data.length).fill(false));

        // const response2 = await fetch(
        //   `/api/academicAttendance?academicPhaseId=${selectedPhase}&academicSubjectId=${selectedSubject}&batchId=${selectedBatch}&date=2024-11-30,2024-11-30`
        // );

        // console.log("Hello this is response ", await response2.json());
        // const data2: AttendanceData[] = await response2.json();
        // setAttendence(data2);
      } catch (error) {
        toast.error("Failed to load students");
        console.error(error);
      }
    };

    //  fetchStudents();
    fetchStudents();
  }, [selectedPhase]);

  console.log("student", students);

  const areAllFieldsFilled = () => {
    if (
      selectedAY.trim() !== "" &&
      selectedPhase.trim() !== "" &&
      selectedSubject.trim() !== "" &&
      selectedBatch.trim() !== "" &&
      date.trim() !== "" &&
      timeSlot.start.trim() !== "" &&
      timeSlot.end.trim() !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  // useEffect(()=>{
  //   if( !selectedPhase){
  //     setSelectedBatch("")
  //   }
  //   else if(!selectedSubject){

  //     setSelectedBatch("")
  //   }

  //   setSelectedSubject('')
  // },[ selectedBatch, selectedSubject,selectedPhase])

  // Enhanced checkbox change handler
  const handleCheckboxChange = (index: number) => {
    const newChecked = [...checkedStudents];
    newChecked[index] = !newChecked[index];

    const newAbsent = [...markAbsent];
    newAbsent[index] = false;

    setCheckedStudents(newChecked);
    setMarkAbsent(newAbsent);
  };

  // Enhanced absent checkbox change handler
  const handleAbsentChange = (index: number) => {
    const newAbsent = [...markAbsent];
    newAbsent[index] = !newAbsent[index];

    const newChecked = [...checkedStudents];
    newChecked[index] = false;

    setMarkAbsent(newAbsent);
    setCheckedStudents(newChecked);
  };

  // Handle submit
  const handleSubmit = () => {
    const presentStudents = students.filter(
      (_, index) => checkedStudents[index]
    );
    const absentStudents = students.filter((_, index) => markAbsent[index]);

    setPreviewData({
      presentStudents: presentStudents.map((s) => ({
        name: s.studentName,
        rollNumber: s.rollNumber,
      })),
      absentStudents: absentStudents.map((s) => ({
        name: s.studentName,
        rollNumber: s.rollNumber,
      })),
      subject:
        subjects.find((s) => s.subjectId === selectedSubject)?.subjectName ||
        "",
      attendanceDate: moment(attendanceDate).format("DD-MM-YYYY"),
    });

    setShowPreview(true);
  };

  // Handle final submission
  const handleConfirmAttendance = async () => {
    const attendanceRecords = students
      .map((student, index) => {
       
        if (checkedStudents[index] || markAbsent[index]) {
       
          return {
            studentId: student.id,
            isPassing:checkedStudents[index] ? true : false,
            
            
          };
        }
      })
      .filter(Boolean);

    const transferStudents = {
      createdBy: user?.id,
      currentAcademicYearId: selectedAY,
      currentPhaseId: selectedPhase,
      nextPhaseId: selectedNextPhase,
      studentTransferData: attendanceRecords,
    };

    try {
      const response = await fetch("/api/academicPhaseTransfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferStudents),
      });

      if (response.ok) {
        toast.success("Attendance recorded successfully");
        setCheckedStudents(new Array(students.length).fill(true));
        setMarkAbsent(new Array(students.length).fill(false));
        setShowPreview(false);
        setMessege(`Student of Academic Year : ${selectedAY} successfully transferred to next Academic Year : ${nextAcademicYear} next  phase.`);
      } else {
        throw new Error("Failed to save attendance");
      }
    } catch (error) {
      toast.error("Failed to save attendance");
      console.error(error);
    }
  };

  // Bulk actions
  const handleCheckAll = () => {
    setCheckedStudents(new Array(students.length).fill(true));
    setMarkAbsent(new Array(students.length).fill(false));
  };

  const handleAbsentAll = () => {
    setCheckedStudents(new Array(students.length).fill(false));
    setMarkAbsent(new Array(students.length).fill(true));
  };

  const handleClearAll = () => {
    setCheckedStudents(new Array(students.length).fill(false));
    setMarkAbsent(new Array(students.length).fill(false));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight
    return date > today; // Disable dates after today
  };

  const AttendanceRecord: React.FC<{ data: AttendanceData[] }> = ({ data }) => {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell>Roll No.</TableCell>
            <TableCell>Father's Name</TableCell>
            <TableCell>Attendance Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((attendance) => (
            <TableRow key={attendance.attendanceId}>
              <TableCell>{attendance.studentName}</TableCell>
              <TableCell>{attendance.studentRollNumber}</TableCell>
              <TableCell>{attendance.studentFatherName}</TableCell>
              <TableCell>{attendance.attendanceStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="max-w-7xl mx-auto my-2">
      <CardHeader>
        <div className=" flex justify-between">
          <CardTitle>Student Transfer</CardTitle>
          <div className="flex space-x-2">
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
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Current Phase <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedPhase}
                onValueChange={setSelectedPhase}
                disabled={!selectedAY}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases &&
                    phases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Next Phase of {nextAcademicYear}
                <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedNextPhase}
                onValueChange={setSelectedNextPhase}
                disabled={!selectedAY}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {nextPhases &&
                    nextPhases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"></div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {Messege && (
           <div className="flex items-center h-[400px] justify-center   rounded-lg p-4   transition-all duration-300 ease-in-out">
           <div className="flex items-center space-x-3 w-[70%]">
             <Check className="text-green-600 w-28 h-28 animate-bounce" />
             <span className="text-green-800 text-2xl font-semibold tracking-wide">
               {Messege}
             </span>
           </div>
         </div>
        )}

        {!Messege && !error && students.length > 0 && (
          <AttendanceTable
            students={students}
            checkedStudents={checkedStudents}
            markAbsent={markAbsent}
            onCheckChange={handleCheckboxChange}
            onAbsentChange={handleAbsentChange}
            onSubmit={handleSubmit}
            onClearAll={handleClearAll}
            onAbsentAll={handleAbsentAll}
            onCheckAll={handleCheckAll}
          />
        )}

        {/* <AttendanceRecord data = {attendence} /> */}

        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={handleConfirmAttendance}
          data={previewData}
        />
      </CardContent>
    </Card>
  );
}
