// OtpValidate.ts
const OtpValidate = async (otpTime: number): Promise<boolean> => {
    try {
        console.log('OTP Generation Time (milliseconds): ' + otpTime);
        
        const cDateTime = Date.now(); // Current time in milliseconds
        const differenceValues = (cDateTime - otpTime) / 1000 / 60; // Difference in minutes
        console.log("Difference in Minutes: " + differenceValues);
        
        // Check if the OTP is older than 9 minutes
        if (differenceValues > 9) {
            return true; // OTP is expired
        }
        
        return false; // OTP is still valid
    } catch (error: any) {
        console.log(error.message);
        return false; // Return false in case of an error
    }
};

export { OtpValidate };
