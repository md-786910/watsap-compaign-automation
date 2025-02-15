const User = require("../model/user.model");

const countCreditLeft = async (id) => {
  const userCredit = await User.findOne({ _id: id });
  const { total_credit, remaining_credit, used_credit } = userCredit;
  if (remaining_credit < 0 || used_credit > total_credit) {
    return false;
  }
  return true;
};
module.exports = {
  countCreditLeft,
};
