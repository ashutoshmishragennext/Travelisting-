"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCSVSample } from "@/lib/csv-utils";
import { StudentTable } from "../StudentTable";
import { useCurrentUser } from "@/hooks/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Zod schema for single student
const studentSchema = z.object({
  rollNumber: z.number(),
  studentName: z.string().min(1, "Student name is required"),
  enrollmentNumber: z.string().min(1, "Enrollment number is required"),
  admissionYear: z.number().min(2000, "Admission year must be valid"),
  studentMobile: z.string().optional(),
  fatherName: z.string().optional(),
  fatherEmail: z
    .string()
    .optional()
    .refine(
      (email) => (email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true),
      { message: "Invalid email format" }
    ),
  fatherMobile: z.string().optional(),
  motherName: z.string().optional(),
  motherMobile: z.string().optional(),
  phase: z.string().min(1, "Phase is required"),
  createdBy: z.string().optional(),
  academicYear: z.string().optional(), // Added academic year
});

// Zod schema for file upload (allows optional fields with more flexible parsing)
const csvStudentSchema = z
  .object({
    rollNumber: z.number().or(z.string()).transform(Number),
    enrollmentNumber: z.string(),
    studentName: z.string().min(1, "Student name is required"),
    admissionYear: z
      .number()
      .or(z.string())
      .transform(Number)
      .refine((val) => val >= 2000, "Admission year must be valid"),
    studentMobile: z.string().optional(),
    fatherName: z.string().optional(),
    fatherEmail: z
      .string()
      .optional()
      .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: "Invalid email format",
      }),
    fatherMobile: z.string().optional(),
    motherName: z.string().optional(),
    motherMobile: z.string().optional(),
    phase: z.string().min(1, "Phase is required"),
    createdBy: z.string().optional(),
    academicYear: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    // Ensure all optional string fields are either a string or undefined
    studentMobile: data.studentMobile || "",
    fatherMobile: data.fatherMobile || "",
    motherMobile: data.motherMobile || "",
  }));
// Define interfaces
interface Phase {
  id: string;
  name: string;
  phaseType: string;
  academicYear: string;
  isActive: boolean;
}

interface AY {
  id: string;
  academicYear: string;
}
export const StudentRegistrationForm = () => {
  const [activeTab, setActiveTab] = useState("csv");
  const [AY, setAY] = useState<AY[]>([]);
  const [selectedAY, setSelectedAY] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<z.infer<typeof studentSchema>[]>([]);
  const [parsedCSVData, setParsedCSVData] = useState<
    z.infer<typeof csvStudentSchema>[]
  >([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>("");
  const [parsedCSVDataForRequest, setParsedCSVDataForRequest] = useState<
    z.infer<typeof csvStudentSchema>[]
  >([]);

  const user = useCurrentUser();

  // Use Zod resolver with react-hook-form
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      phase: "",
      rollNumber: 0,
      enrollmentNumber: "",
      studentName: "",
      fatherName: "",
      fatherMobile: "",
      studentMobile: "",
      fatherEmail: "",
      admissionYear: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    const fetchAY = async () => {
      try {
        const response = await fetch("/api/academicYear");
        const data = await response.json();
        if (data.length) setAY(data);
        if (data && data.length > 0) {
          setSelectedAY(data[0].id);
        }
        setStudents([]);
      } catch (error) {
        toast.error("Failed to load Academic Year");
        console.error(error);
      }
    };
    fetchAY();
  }, []);
  // Fetch phases
  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await fetch(
          `/api/academicPhase?academicYear=${selectedAcademicYear}&orderBy=name,asc`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch phases");
        }
        const data: Phase[] = await response.json();
        setPhases(data);

        // Set first active phase as default if available
        const activePhase = data.find((phase) => phase.isActive);
        if (activePhase) {
          setSelectedPhaseId(activePhase.id);
        } else if (data.length > 0) {
          // If no active phase, select first phase
          setSelectedPhaseId(data[0].id);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPhases();
  }, [selectedAcademicYear]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFile = files[0];
      if (selectedFile.type !== "text/csv") {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);

      // Parse the CSV file and set the parsed data
      parseCSV(selectedFile)
        .then((data) => {
          setParsedCSVData(data);
          toast.success(`Parsed ${data.length} student records`);
        })
        .catch((error) => {
          toast.error(error.message);
          setParsedCSVData([]);
        });
    }
  };

  const parseCSV = async (
    file: File
  ): Promise<z.infer<typeof csvStudentSchema>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          console.log("Full CSV text:", text); // Log entire CSV content

          // Improve line splitting to handle different line endings and trim
          const lines = text
            .split(/\r\n|\n|\r/)
            .filter((line) => line.trim() !== "");
          console.log("Number of lines:", lines.length);
          console.log("Headers:", lines[0]);

          if (lines.length < 2) {
            throw new Error("CSV file is empty or missing data");
          }

          // More robust header parsing
          const headers = lines[0]
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((header) => header.trim().replace(/^"|"$/g, ""));
          console.log("Parsed Headers:", headers);

          const requiredHeaderSets = {
            rollNumber: ["Roll Number", "Roll", "Sr.No."],
            enrollmentNumber: [
              "Enrollment Number",
              "Enrollment No",
              "Unique ID",
            ],
            studentName: ["Student Name", "Name of student", "Name"],
          };

          // Create a more flexible header validation function
          const validateHeaders = (headers: string[]) => {
            const missingHeaders: string[] = [];

            // Check each required header set
            Object.entries(requiredHeaderSets).forEach(
              ([key, possibleHeaders]) => {
                const isHeaderPresent = possibleHeaders.some((header) =>
                  headers.some(
                    (h) =>
                      h.toLowerCase().trim() === header.toLowerCase().trim()
                  )
                );

                if (!isHeaderPresent) {
                  missingHeaders.push(key);
                }
              }
            );

            if (missingHeaders.length > 0) {
              throw new Error(
                `Missing required header sets: ${missingHeaders.join(", ")}`
              );
            }
          };

          validateHeaders(headers);

          const jsonData: z.infer<typeof csvStudentSchema>[] = [];

          for (let i = 1; i < lines.length; i++) {
            // More robust line splitting that handles quoted fields
            const values = lines[i]
              .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
              .map((value) => value.trim().replace(/^"|"$/g, ""));

            if (values.length !== headers.length) {
              throw new Error(
                `Invalid data in row ${i + 1}. Expected ${
                  headers.length
                } columns, got ${values.length}`
              );
            }

            // Improved header value matching
            const getHeaderValue = (possibleHeaders: string[]) => {
              const normalizedHeaders = headers.map((h) =>
                h.toLowerCase().trim()
              );
              const foundHeaderIndex = possibleHeaders
                .map((h) => h.toLowerCase().trim())
                .findIndex((h) => normalizedHeaders.includes(h));

              return foundHeaderIndex !== -1
                ? values[
                    normalizedHeaders.indexOf(
                      possibleHeaders[foundHeaderIndex].toLowerCase().trim()
                    )
                  ]
                : "";
            };

            const row = {
              rollNumber: Number(
                getHeaderValue(["Roll Number", "Roll", "Sr.No."])
              ),
              enrollmentNumber: getHeaderValue([
                "Enrollment Number",
                "Enrollment No",
                "Unique ID",
              ]),
              studentName: getHeaderValue([
                "Student Name",
                "Name of student",
                "Name",
              ]),
              admissionYear: Number(
                getHeaderValue(["Admission Year", "Admission"])
              ),
              studentMobile: getHeaderValue([
                "Student Mobile",
                "Student Contact No",
                "Student's Contact no",
                "studentMobile",
              ]),
              fatherName: getHeaderValue(["Father Name", "Father's Name"]),
              fatherEmail: getHeaderValue(["Father Email", "Father's Email"]),
              fatherMobile: getHeaderValue([
                "Father Mobile",
                "Father Contact No",
                "Father's Contact No",
                "fatherMobile",
              ]),
              motherName: getHeaderValue(["Mother Name", "Mother's Name"]),
              motherMobile: getHeaderValue([
                "Mother Mobile",
                "Mother Contact No",
                "Mother's Contact No",
              ]),
              phase: getHeaderValue(["Phase"]),
              createdBy: user?.id || "unknown",
              // Explicitly ensure academicYear is a string
              academicYear:
                getHeaderValue(["AcademicYear", "Academic Year"]) ||
                selectedAcademicYear,
            };

            console.log("Parsed Row:", row);

            // Parse with CSV schema (more lenient)
            const parseResult = csvStudentSchema.safeParse(row);
            if (parseResult.success === false) {
              console.error("Validation Errors:", parseResult.error.errors);
              throw new Error(
                `Validation error in row ${i + 1}: ${parseResult.error.errors
                  .map((e) => `${e.path}: ${e.message}`)
                  .join(", ")}`
              );
            }
            jsonData.push(parseResult.data);
            console.log("Parsed DAta", jsonData);
            setParsedCSVDataForRequest(jsonData);
          }

          resolve(jsonData);
        } catch (error) {
          console.error("CSV Parsing Error:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  };

  const handleManualCSVUpload = async () => {
    try {
      if (parsedCSVDataForRequest.length === 0) {
        toast.error("No parsed CSV data available");
        return;
      }

      setIsSubmitting(true);
      const response = await fetch(`/api/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedCSVDataForRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setStudents((prevStudents) => [
        ...prevStudents,
        ...parsedCSVDataForRequest,
      ]);
      toast.success(
        `${parsedCSVDataForRequest.length} student(s) registered successfully!`
      );

      // Reset states
      setFile(null);
      setParsedCSVDataForRequest([]);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error registering student(s):", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to register student(s)!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (formData: z.infer<typeof studentSchema>) => {
    try {
      console.log("Hello");

      setIsSubmitting(true);
      let data: z.infer<typeof studentSchema>[];

      if (activeTab === "csv") {
        if (!file) {
          toast.error("Please select a CSV file");
          return;
        }

        // For CSV, we've already validated during parsing
        data = parsedCSVData.map((csvData) => ({
          ...csvData,
          studentMobile: csvData.studentMobile,
          fatherMobile: csvData.fatherMobile,
        }));
      } else {
        // Validate manual entry with the more strict schema
        const parseResult = studentSchema.safeParse({
          ...formData,
          createdBy: user?.id || "unknown",
          academicYear: selectedAcademicYear,
        });

        if (!parseResult.success) {
          toast.error(parseResult.error.errors[0].message);
          return;
        }

        data = [parseResult.data];
      }

      // Simulating API call
      const response = await fetch(`/api/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setStudents((prevStudents) => [...prevStudents, ...data]);
      toast.success("Student(s) registered successfully!");

      // Reset form
      if (activeTab === "csv") {
        setFile(null);
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        setParsedCSVData([]);
      } else {
        form.reset();
      }
    } catch (error) {
      console.error("Error registering student(s):", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to register student(s)!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset form when switching tabs
    if (value === "csv") {
      setFile(null);
      setParsedCSVData([]);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } else {
      form.reset();
    }
  };

  return (
    <div className="flex flex-col justify-center w-full space-y-4">
      <div className="">
        <Card className="max-w-3xl m-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Register Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="csv"
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <TabsContent value="csv" className="grid w-full space-y-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => downloadCSVSample()}
                      className="w-full"
                    >
                      Download CSV Sample
                    </Button>
                    <FormField
                      name="csvFile"
                      render={() => (
                        <FormItem>
                          <FormLabel>Upload CSV File</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".csv"
                              onChange={handleFileChange}
                              className="cursor-pointer"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent
                    value="manual"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-3 gap-x-6"
                  >
                    {/* Academic Year Selection */}
                    <FormItem>
                      <FormLabel>Academic Year</FormLabel>
                      <Select
                        value={selectedAcademicYear}
                        onValueChange={(year) => {
                          setSelectedAcademicYear(year);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Academic Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {AY &&
                            AY.map((AY) => (
                              <SelectItem key={AY.id} value={AY.id}>
                                {AY.academicYear}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {/* {!selectedAcademicYear && (
                      <FormMessage>Academic Year is required</FormMessage>
                    )} */}
                    </FormItem>

                    {Object.keys(form.getValues()).map((key) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof z.infer<typeof studentSchema>}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </FormLabel>
                            <FormControl>
                              {key === "phase" ? (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value ? "" : ""}
                                  disabled={selectedAcademicYear === ""}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Phase" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {phases.map((phase) => (
                                      <SelectItem
                                        key={phase.name}
                                        value={phase.name}
                                      >
                                        {phase.name}
                                      </SelectItem>
                                    ))}
                                    {/* <SelectItem
                                    value={`${new Date().getFullYear()} Phase I`}
                                  >
                                    {new Date().getFullYear()}-Phase I
                                  </SelectItem>
                                  <SelectItem
                                    value={`${
                                      new Date().getFullYear() - 1
                                    } Phase II`}
                                  >
                                    {new Date().getFullYear() - 1}-Phase II
                                  </SelectItem>
                                  <SelectItem
                                    value={`${
                                      new Date().getFullYear() - 2
                                    } Phase III Part 1`}
                                  >
                                    {new Date().getFullYear() - 2}-Phase III
                                    Part 1
                                  </SelectItem>
                                  <SelectItem
                                    value={`${
                                      new Date().getFullYear() - 3
                                    } Phase III Part 2`}
                                  >
                                    {new Date().getFullYear() - 3}-Phase III
                                    Part 2
                                  </SelectItem> */}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  {...field}
                                  type={
                                    key.includes("email")
                                      ? "email"
                                      : key.includes("Year") ||
                                        key.includes("Mobile") ||
                                        key.includes("Number")
                                      ? "tel"
                                      : "text"
                                  }
                                  required
                                  onChange={(e) => {
                                    // Convert to number for numeric fields
                                    const value =
                                      key === "rollNumber" ||
                                      key === "admissionYear"
                                        ? Number(e.target.value)
                                        : e.target.value;
                                    field.onChange(value);
                                  }}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </TabsContent>
                  {activeTab !== "csv" && (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : activeTab === "csv"
                        ? "Upload CSV"
                        : "Register Student"}
                    </Button>
                  )}

                  {activeTab === "csv" && (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleManualCSVUpload}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Upload CSV"}
                    </Button>
                  )}
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Display parsed CSV data */}
      {parsedCSVData.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Parsed CSV Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* <Accordion type="single" collapsible> */}
            {/* {parsedCSVData.map((student, index) => (
                <AccordionItem key={index} value={`student-${index}`}>
                  <AccordionTrigger>
                    Student {index + 1}: {student.studentName}
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                      {JSON.stringify(student, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))} */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Enrollment No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Father's Contact</TableHead>
                    <TableHead>Student's Contact</TableHead>
                    <TableHead>Father's Email</TableHead>
                    <TableHead>Admission Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedCSVData.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.academicYear}</TableCell>
                      <TableCell>{student.phase}</TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.enrollmentNumber}</TableCell>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell>{student.fatherMobile}</TableCell>
                      <TableCell>{student.studentMobile}</TableCell>
                      <TableCell>{student.fatherEmail}</TableCell>
                      <TableCell>{student.admissionYear}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* </Accordion> */}
          </CardContent>
        </Card>
      )}

      {students.length > 0 && <StudentTable students={students} />}
    </div>
  );
};
