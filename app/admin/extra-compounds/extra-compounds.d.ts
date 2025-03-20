enum ConcentrationUnit {
  MG_ML = "MG_ML",
  MG = "MG",
}

enum HormoneUnit {
  MG = "MG",
  ML = "ML",
  UI = "UI",
  GR = "GR",
  MCG = "MCG",
}

type ExtraCompounds = {
  id: string;
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
