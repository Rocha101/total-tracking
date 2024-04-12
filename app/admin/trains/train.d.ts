enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export type Train = {
  id: string;
  name: string;
  description: string;
  weekDays: WeekDay[];
  createdAt: string;
  updatedAt: string;
  accountId: string;
  exercises: Exercise[];
};
