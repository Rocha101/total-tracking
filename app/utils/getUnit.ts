const getUnit = (unit: "MG" | "ML" | "UI" | "UNIT" | "GR" | "MCG") => {
  switch (unit) {
    case "MG":
      return "mg";
    case "ML":
      return "ml";
    case "UI":
      return "UI";
    case "UNIT":
      return "Unidade";
    case "GR":
      return "gr";
    case "MCG":
      return "mcg";
    default:
      return "";
  }
};

export default getUnit;
