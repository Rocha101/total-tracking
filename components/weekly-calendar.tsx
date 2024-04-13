import React from "react";
import { Train } from "@/app/admin/trains/train";
import { Badge } from "./ui/badge";

interface WeeklyCalendarProps {
  trainsSelected: Train[];
  removeTrainSelected: (trainId: string) => void;
}
enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
const WeeklyCalendar = ({
  trainsSelected,
  removeTrainSelected,
}: WeeklyCalendarProps) => {
  // Define the days of the week
  const daysOfWeek = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
    WeekDay.SATURDAY,
    WeekDay.SUNDAY,
  ];

  // Function to check if a train should be displayed on a particular day
  const shouldDisplayTrain = (train: Train, dayOfWeek: WeekDay) => {
    return train.weekDays.includes(dayOfWeek as WeekDay);
  };

  return (
    <div className="w-full flex gap-2">
      {/* Map through each day of the week */}
      {daysOfWeek.map((day, index) => (
        <div
          key={index}
          className="w-full flex flex-col items-center bg-card p-3 gap-3"
        >
          <h3>
            {
              {
                [WeekDay.MONDAY]: "Segunda",
                [WeekDay.TUESDAY]: "Terça",
                [WeekDay.WEDNESDAY]: "Quarta",
                [WeekDay.THURSDAY]: "Quinta",
                [WeekDay.FRIDAY]: "Sexta",
                [WeekDay.SATURDAY]: "Sábado",
                [WeekDay.SUNDAY]: "Domingo",
              }[day as WeekDay]
            }
          </h3>
          {/* Map through each train and display if it should be shown on this day */}
          {trainsSelected.map(
            (train) =>
              shouldDisplayTrain(train, day) && (
                <Badge
                  key={train.id}
                  variant="default"
                  onClick={() => removeTrainSelected(train.id)}
                >
                  {train.name}
                </Badge>
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;
