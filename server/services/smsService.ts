// // server/services/smsService.ts

// import twilio from 'twilio';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// // Initialize Twilio client
// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // Function to send SMS
// export const sendSMS = (to: string, messageBody: string): Promise<string> => {
//   return client.messages
//     .create({
//       body: messageBody,
//       from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
//       to: to, // Recipient phone number
//     })
//     .then((message) => {
//       console.log(`Message sent to ${to}, SID: ${message.sid}`);
//       return message.sid; // Return message SID for future reference
//     })
//     .catch((error) => {
//       console.error(`Failed to send SMS to ${to}: ${error}`);
//       throw error;
//     });
// };



// // server/services/smsService.ts
// import dotenv from "dotenv";
// dotenv.config();
// import twilio from "twilio";

// // Validate environment variables
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// if (!accountSid || !authToken || !twilioPhone) {
//   throw new Error("❌ Twilio environment variables are missing");
// }

// // Initialize Twilio client
// const client = twilio(accountSid, authToken);

// // Function to send SMS
// export const sendSMS = async (to: string, messageBody: string): Promise<string> => {
//   try {
//     const message = await client.messages.create({
//       body: messageBody,
//       from: twilioPhone,
//       to: to,
//     });

//     console.log(`✅ SMS sent to ${to}, SID: ${message.sid}`);
//     return message.sid;
//   } catch (error: any) {
//     console.error(`❌ Failed to send SMS to ${to}:`, error.message);
//     throw error;
//   }
// };

// import twilio from "twilio";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // Debug: Log the values to see if they are correctly loaded
// console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
// console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
// console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

// // Validate environment variables
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// if (!accountSid || !authToken || !twilioPhone) {
//   throw new Error("❌ Twilio environment variables are missing");
// }

// // Initialize Twilio client
// const client = twilio(accountSid, authToken);

// // Function to send SMS
// export const sendSMS = async (to: string, messageBody: string): Promise<string> => {
//   try {
//     const message = await client.messages.create({
//       body: messageBody,
//       from: twilioPhone,
//       to: to,
//     });

//     console.log(`✅ SMS sent to ${to}, SID: ${message.sid}`);
//     return message.sid;
//   } catch (error: any) {
//     console.error(`❌ Failed to send SMS to ${to}:`, error.message);
//     throw error;
//   }
// };





// server/services/smsService.ts
import twilio from "twilio";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env (adjust path if your .env is somewhere else)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Validate environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhone) {
  throw new Error("❌ Twilio environment variables are missing");
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to send SMS
export const sendSMS = async (to: string, messageBody: string): Promise<string> => {
  try {
    const message = await client.messages.create({
      body: messageBody,
      from: twilioPhone,
      to: to,
    });

    console.log(`✅ SMS sent to ${to}, SID: ${message.sid}`);
    return message.sid;
  } catch (error: any) {
    console.error(`❌ Failed to send SMS to ${to}:`, error.message);
    throw error;
  }
};

// ===== Example usage =====
// Only run this if this file is executed directly (not when imported)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const testPhoneNumber = "+919702805863"; // Replace with a valid number
  const message = "Test SMS from your app 🚀";

  sendSMS(testPhoneNumber, message)
    .then((sid) => {
      console.log(`SMS sent successfully, SID: ${sid}`);
    })
    .catch((error) => {
      console.error("Error sending SMS:", error);
    });
}