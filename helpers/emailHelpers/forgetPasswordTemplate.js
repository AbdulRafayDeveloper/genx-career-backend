const generateForgetPasswordTemplate = (name, otp) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #ECECEC; color: #595959;">
      <div style="width: 100%; max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #9866C7; color: #fff; text-align: center; padding: 20px;">
          <h1 style="margin: 0;">GenX Career</h1>
          <div style="font-size: 16px;">Reset Your Password</div>
        </div>

        <!-- Body -->
        <div style="padding: 30px; background-color: #f9f9f9; font-size: 16px; line-height: 1.8;">
          <p style="margin: 0 0 15px;">Hi <strong>${name}</strong>,</p>
          <p style="margin: 0 0 15px;">You recently requested to reset your password. Please use the OTP below to continue:</p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #9866C7;">${otp}</span>
          </div>

          <p style="margin: 0 0 15px;">If you did not request this password reset, you can safely ignore this email.</p>
          <p style="margin: 0 0 15px;">This OTP is valid for a limited time. Please complete the reset process as soon as possible.</p>

          <p style="margin: 0;">Best Regards,</p>
          <p style="margin: 0;">The GenX Career Team</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #9866C7; text-align: center; padding: 20px; font-size: 14px; color: #ECECEC;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} GenX Career. All rights reserved.</p>
          <p style="margin: 0;">Helping you build your IT career with confidence.</p>
        </div>
      </div>
    </body>
  </html>
`;

export default generateForgetPasswordTemplate;
