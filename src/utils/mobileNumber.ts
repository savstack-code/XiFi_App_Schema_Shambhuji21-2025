export function combineMobileUmber(
  mobileNumber: string | number,
  countryCode?: string | number
) {
  if (typeof countryCode === "undefined") {
    return ("" + mobileNumber).replace(/ /g, "");
  }
  const cc = ("" + countryCode).replace(/^ /, "+").replace(/ /g, "");
  return `${cc} ${("" + mobileNumber).replace(/ /g, "")}`;
}

export function getCountryCodeMobileNumber(mobileNumber: string) {
  const mobileNumberArray = mobileNumber.split(" ");
  const countryCode = mobileNumberArray.length == 2 ? mobileNumberArray[0] : "";
  const plainMobileNumber =
    mobileNumberArray.length == 2 ? mobileNumberArray[1] : mobileNumber;
  return {
    countryCode: countryCode,
    mobileNumber: plainMobileNumber,
  };
}
