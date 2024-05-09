const getMealUnit = (unit: string) => {
  switch (unit) {
    case "GR":
      return "gr";
    case "ML":
      return "ml";
    case "UNIT":
      return "un";
    default:
      return "N.I.";
  }
};

export default getMealUnit;
