import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  start: string;
  end: string;
}

interface TimeRangePickerProps {
  onTimeChange: (timeSlot: TimeSlot) => void;
  defaultValue?: TimeSlot;
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  onTimeChange,
  defaultValue
}) => {
  // Function to convert 24-hour time to 12-hour format with AM/PM
  const convertTo12HourFormat = (time?: string): string => {
    // Return a default time if no time is provided
    if (!time) {
      const now = new Date();
      time = `${now.getHours().toString().padStart(2, '0')}:00`;
    }

    // Ensure time is a string and contains ':'
    if (typeof time !== 'string' || !time.includes(':')) {
      const now = new Date();
      time = `${now.getHours().toString().padStart(2, '0')}:00`;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours.toString().padStart(2, '0')}:00 ${period}`;
  };

  // Function to convert 12-hour format back to 24-hour format
  const convertTo24HourFormat = (time?: string): string => {
    // Return current time if no time is provided
    if (!time) {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:00`;
    }

    const [timepart, period] = time.split(' ');
    if (!timepart || !period) {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:00`;
    }

    let hours = parseInt(timepart.split(':')[0]);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:00`;
  };

  // Generate time options for the entire day in 1-hour intervals in 24-hour format
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, "0")}:00`;
  });

  // Convert time options to 12-hour format for display
  const displayTimeOptions = timeOptions.map(convertTo12HourFormat);

  // Get current time rounded to the nearest hour
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:00`;
  };

  // Get end time (1 hour after start time)
  const getEndTime = (startTime: string) => {
    const [startHour] = startTime.split(':').map(Number);
    const endHour = (startHour + 1) % 24;
    return `${endHour.toString().padStart(2, '0')}:00`;
  };

  // Filter available end times based on selected start time
  const getAvailableEndTimes = (startTime: string) => {
    if (!startTime) return timeOptions;
    const [startHour] = startTime.split(':').map(Number);
    return timeOptions.filter(time => {
      const [endHour] = time.split(':').map(Number);
      return endHour !== startHour;
    });
  };

  // Initialize state with default or current times
  const [startTime, setStartTime] = useState<string>(
    defaultValue?.start 
      ? convertTo24HourFormat(defaultValue.start) 
      : getCurrentTime()
  );
  const [endTime, setEndTime] = useState<string>(
    defaultValue?.end 
      ? convertTo24HourFormat(defaultValue.end) 
      : getEndTime(startTime)
  );

  // Effect to update parent component when times change
  useEffect(() => {
    onTimeChange({ 
      start: startTime,  // Directly pass 24-hour format
      end: endTime       // Directly pass 24-hour format
    });
  }, [startTime, endTime]);

  const handleStartTimeChange = (value: string) => {
    // Convert 12-hour time back to 24-hour format
    const startTimeIn24Hour = convertTo24HourFormat(value);
    
    // Set the start time
    setStartTime(startTimeIn24Hour);
    
    // Automatically set end time to 1 hour after
    const autoEndTime = getEndTime(startTimeIn24Hour);
    
    // Get available end times based on the new start time
    const availableEndTimes = getAvailableEndTimes(startTimeIn24Hour);
    
    // If auto-calculated end time is valid, use it
    // Otherwise, use the first available end time
    const finalEndTime = availableEndTimes.includes(autoEndTime) 
      ? autoEndTime 
      : availableEndTimes[0];
    
    setEndTime(finalEndTime);
  };

  const handleEndTimeChange = (value: string) => {
    // Convert 12-hour time back to 24-hour format
    const endTimeIn24Hour = convertTo24HourFormat(value);
    setEndTime(endTimeIn24Hour);
  };

  return (
    <div className="flex gap-2">
      <Select
        onValueChange={handleStartTimeChange}
        value={convertTo12HourFormat(startTime)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Start" />
        </SelectTrigger>
        <SelectContent>
          {displayTimeOptions.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={handleEndTimeChange}
        value={convertTo12HourFormat(endTime)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="End" />
        </SelectTrigger>
        <SelectContent>
          {getAvailableEndTimes(startTime)
            .map(convertTo12HourFormat)
            .map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRangePicker;