const trimToString = (str) => {
  if (typeof str == 'string') {
    return str.trim();
  }
};

const isDateInFuture = (str) => {
  const currentDate = new Date();
  const inputDate = new Date(str);
  return currentDate <= inputDate;
};

module.exports = { trimToString, isDateInFuture };
