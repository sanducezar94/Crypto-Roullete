const validate = (param, message) => {
  if (typeof param === "boolean") {
    if (param) throw message;
  } else {
    if (!param || param.length === 0) throw message;
  }
};

module.exports = validate;