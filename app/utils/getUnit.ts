const getUnit = (unit: "MG" | "ML" | "UI" | "UNIT") => {
  switch (unit) {
    case "MG":
      return "mg";
    case "ML":
      return "ml";
    case "UI":
      return "UI";
    case "UNIT":
      return "Unidade";
    default:
      return "";
  }
};

export default getUnit;
