enum ConcentrationUnit {
  MG_ML = "MG_ML",
  MG = "MG",
}

enum HormoneUnit {
  MG = "MG",
  ML = "ML",
  UI = "UI",
}

type ExtraCompounds = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  concentration: number;
  unit: HormoneUnit;
  concentrationUnit: ConcentrationUnit;
  createdAt: string;
  updatedAt: string;
};

export default ExtraCompounds;
