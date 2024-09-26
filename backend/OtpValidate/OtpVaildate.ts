const OtpValidate = async (otpTime: number): Promise<boolean> => {
  try {
    console.log("OTP Generation Time (milliseconds): " + otpTime);

    const cDateTime = Date.now(); // Current time in milliseconds
    const differenceValues = (cDateTime - otpTime) / 1000 / 60;
    console.log("Difference in Minutes: " + differenceValues);

    // Check if the OTP is older than 9 minutes
    if (differenceValues > 9) {
      return true; // OTP is expired
    }

    return false;
  } catch (error) {
    console.log((error as any).message); 
    return false;
};
}
export default OtpValidate;
