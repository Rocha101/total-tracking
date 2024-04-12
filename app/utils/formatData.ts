const formatDate = (date: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("pt-BR");
};

export default formatDate;
