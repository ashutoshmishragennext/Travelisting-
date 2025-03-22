import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PreviewData } from '@/types/type';
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; // Change to return a Promise
  data: PreviewData;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true); // Set loading to true when confirming
    await onConfirm(); // Wait for the confirmation to complete
    setLoading(false); // Reset loading after confirmation
  };


  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <DialogHeader>
            <DialogTitle>Attendance Preview</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p><strong>Subject:</strong> {data.subject}</p>
              <p><strong>Date:</strong> {data.attendanceDate}</p>
            </div>

            <div>
              <h3 className="text-green-600 font-semibold">
                Present Students: {data.presentStudents.length}
              </h3>
              
              <h3 className="text-red-600 font-semibold">
                Absent Students: {data.absentStudents.length}
              </h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.absentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? 'Submitting...' : 'Confirm Attendance'}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
