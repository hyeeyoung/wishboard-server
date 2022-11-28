const trimToString = (str) => {
  if (typeof str == 'string') {
    return str.trim();
  }
};

module.exports = { trimToString };
