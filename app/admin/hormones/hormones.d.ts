enum ConcentrationUnit {
  MG_ML = "MG_ML",
  MG = "MG",
}

enum HormoneUnit {
  MG = "MG",
  ML = "ML",
  UI = "UI",
}

enum HormoneType {
  NINETEEN_NOR = "NINETEEN_NOR",
  DHT = "DHT",
  TESTOSTERONE = "TESTOSTERONE",
  PEPTIDE = "PEPTIDE",
  INSULIN = "INSULIN",
  TIREOID = "TIREOID",
}

type Hormone = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  concentration: number;
  unit: HormoneUnit;
  concentrationUnit: ConcentrationUnit;
  hormoneType: HormoneType;
  createdAt: string;
  updatedAt: string;
};

export default Hormone;
