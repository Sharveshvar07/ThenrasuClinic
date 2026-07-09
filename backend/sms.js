import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendSMS(to, message) {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM;

  // Format recipient number (ensure it has country code if not present, e.g. +91 for India)
  let formattedTo = to.trim();
  if (!formattedTo.startsWith("+")) {
    if (formattedTo.length === 10) {
      formattedTo = `+91${formattedTo}`;
    } else if (formattedTo.length === 12 && formattedTo.startsWith("91")) {
      formattedTo = `+${formattedTo}`;
    }
  }

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const logMessage = `\n========================================\n[${timestamp}] SMS SENT\nTO: ${formattedTo}\nMESSAGE:\n${message}\n========================================\n`;

  // Always write to sms_logs.txt in the backend folder for immediate review
  try {
    const logFilePath = path.join(__dirname, "sms_logs.txt");
    fs.appendFileSync(logFilePath, logMessage, "utf8");
    console.log(`[SMS Logged] Written to backend/sms_logs.txt for to: ${formattedTo}`);
  } catch (err) {
    console.error("Failed to write to sms_logs.txt:", err.message);
  }

  // 1. Twilio Integration (if configured in .env)
  if (twilioSid && twilioAuthToken && twilioFrom) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
      const postData = new URLSearchParams({
        To: formattedTo,
        From: twilioFrom,
        Body: message,
      }).toString();

      const options = {
        hostname: "api.twilio.com",
        port: 443,
        path: `/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[Twilio Success] SMS sent to ${formattedTo}`);
            resolve(JSON.parse(body));
          } else {
            console.error(`[Twilio Error] Status ${res.statusCode}: ${body}`);
            reject(new Error(`Twilio error: ${body}`));
          }
        });
      });

      req.on("error", (err) => {
        console.error("[Twilio Connection Error]:", err.message);
        reject(err);
      });

      req.write(postData);
      req.end();
    });
  }

  // 2. Custom HTTP Gateway Integration (if configured in .env)
  const gatewayUrl = process.env.SMS_GATEWAY_URL;
  if (gatewayUrl) {
    const url = gatewayUrl
      .replace("{{to}}", encodeURIComponent(formattedTo))
      .replace("{{msg}}", encodeURIComponent(message));
    
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
          console.log(`[Gateway Response] Status ${res.statusCode}: ${body}`);
          resolve(body);
        });
      }).on("error", (err) => {
        console.error("[Gateway Connection Error]:", err.message);
        reject(err);
      });
    });
  }

  console.log(`[SMS Simulation] Sent to ${formattedTo} -> "${message}"`);
  return { status: "simulated" };
}
