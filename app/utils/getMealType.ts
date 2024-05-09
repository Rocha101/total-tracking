const getMealType = (mealType: string) => {
  switch (mealType) {
    case "BREAKFAST":
      return "Café da manhã";
    case "MORNING_SNACK":
      return "Lanche da manhã";
    case "LUNCH":
      return "Almoço";
    case "AFTERNOON_SNACK":
      return "Lanche da tarde";
    case "DINNER":
      return "Jantar";
    default:
      return "Tipo não identificado";
  }
};

export default getMealType;
