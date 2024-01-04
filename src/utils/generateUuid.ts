// Create a 3 character uuid. Keep small for simplicity as should be unique enough
export const generateUID = () => {
  let firstPart: string | number = (Math.random() * 46656) | 0;
  let secondPart: string | number = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-1);
  secondPart = ("000" + secondPart.toString(36)).slice(-2);
  return (firstPart + secondPart).toLowerCase();
};
