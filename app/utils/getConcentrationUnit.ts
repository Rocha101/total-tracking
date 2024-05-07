const getConcentrationUnit = (unit: "MG_ML" | "MG") => {
  switch (unit) {
    case "MG_ML":
      return "mg/ml";
    case "MG":
      return "mg";
    default:
      return "";
  }
};

export default getConcentrationUnit;
