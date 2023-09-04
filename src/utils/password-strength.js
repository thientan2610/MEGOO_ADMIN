// has number
const hasNumber = (number) => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed = (number) =>
  new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
const hasSpecial = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

// set color based on password strength
export const strengthColor = (count) => {
  if (count < 2) return { label: "Rất yếu", color: "danger", percentage: 30 };
  if (count < 3) return { label: "Yếu", color: "warning", percentage: 40 };
  if (count < 4)
    return { label: "Bình thường", color: "primary", percentage: 60 };
  if (count < 5) return { label: "Tốt", color: "success", percentage: 80 };
  if (count < 6) return { label: "Mạnh", color: "success", percentage: 100 };
  return { label: "Rất yếu", color: "danger", percentage: 10 };
};

// password strength indicator
export const strengthIndicator = (number) => {
  let strengths = 0;
  if (number.length > 5) strengths += 1;
  if (number.length > 7) strengths += 1;
  if (hasNumber(number)) strengths += 1;
  if (hasSpecial(number)) strengths += 1;
  if (hasMixed(number)) strengths += 1;
  return strengths;
};
