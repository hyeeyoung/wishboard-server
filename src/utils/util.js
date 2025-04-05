const trimToString = (str) => {
  if (typeof str == 'string') {
    return str.trim();
  }
};

const isDateInFuture = (str) => {
  const currentDate = new Date();
  const inputDate = new Date(str);

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const currentKST = formatter.format(currentDate);
  const inputKST = formatter.format(inputDate);
  console.log(currentDate);
  console.log(inputDate);
  console.log(currentKST);
  console.log(inputKST);
  return currentKST <= inputKST;
};

module.exports = { trimToString, isDateInFuture };
