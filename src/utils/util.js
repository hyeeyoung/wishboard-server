const trimToString = (str) => {
  if (typeof str == 'string') {
    return str.trim();
  }
};

const isValidDateFormat = (str) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (datePattern.test(str)) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작
    const currentDay = currentDate.getDate();

    const inputDate = new Date(str);
    const inputYear = inputDate.getFullYear();
    const inputMonth = inputDate.getMonth() + 1; // 월은 0부터 시작
    const inputDay = inputDate.getDate();

    return (
      inputYear >= currentYear &&
      inputMonth >= currentMonth &&
      inputDay >= currentDay
    );
  }
  return false;
};

module.exports = { trimToString, isValidDateFormat };
