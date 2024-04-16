import { Fragment } from "react";
import { Badge } from "./ui/badge";

enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

interface TrainWeekDaysProps {
  weekDaysSelected: WeekDay[];
}

const TrainWeekDays = ({ weekDaysSelected }: TrainWeekDaysProps) => {
  const weekDays = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
    WeekDay.SATURDAY,
    WeekDay.SUNDAY,
  ];
  return (
    <Fragment>
      {weekDays.map((day) => (
        <Badge
          key={day}
          variant={weekDaysSelected.includes(day) ? "default" : "secondary"}
          className="text-[0.6rem] mr-1"
        >
          {
            {
              [WeekDay.MONDAY]: "S",
              [WeekDay.TUESDAY]: "T",
              [WeekDay.WEDNESDAY]: "Q",
              [WeekDay.THURSDAY]: "Q",
              [WeekDay.FRIDAY]: "S",
              [WeekDay.SATURDAY]: "S",
              [WeekDay.SUNDAY]: "D",
            }[day as keyof typeof WeekDay]
          }
        </Badge>
      ))}
    </Fragment>
  );
};

export default TrainWeekDays;
