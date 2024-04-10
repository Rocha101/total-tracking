const enum SetType {
  WARM_UP = "WARM_UP",
  WORKING = "WORKING",
  FEEDER = "FEEDER",
  TOP = "TOP",
  BACK_OFF = "BACK_OFF",
}

interface Rep {
  id: string;
  quantity: number;
  weight: number;
  setType: SetType;
  createdAt: string;
  updatedAt: string;
  setsId: string;
}

interface Set {
  id: string;
  createdAt: string;
  updatedAt: string;
  exerciseId: string;
  reps: Rep[];
}

interface Account {
  id: string;
  email: string;
  name: string;
  password: string;
  accountType: string;
  createdAt: string;
  updatedAt: string;
  coachId: string | null;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  totalTime: number;
  type: string;
  muscleGroup: string;
  equipment: string;
  difficulty: number;
  imageUrl: string | null;
  trainId: string | null;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  sets: Set[];
}

export type { Rep, Set, Account, Exercise, SetType };
