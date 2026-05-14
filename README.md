<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Run Locally

**Prerequisites:**  Node.js 20+

1. Install dependencies:
   `npm install`
2. Create a `.env` file in the root of the project and add your environment variables. Use `.env.example` as a template:
   ```env
   # For Gemini AI features
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   
   # For MongoDB connection (get from Atlas)
   MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority"
   
   # For Nodemailer contact form (use a Gmail App Password)
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-gmail-app-password"
   ```
3. Run the development server:
   `npm run dev`
