import { sendSMS } from "./smsService";

// Replace with a real phone number for testing
const testPhoneNumber = "+919702805863";  // Change this to a valid phone number (Twilio supports any valid phone number)

const message = "Test SMS from your app 🚀";

sendSMS(testPhoneNumber, message)
  .then((sid) => {
    console.log(`SMS sent successfully, SID: ${sid}`);
  })
  .catch((error) => {
    console.error("Error sending SMS:", error);
  });