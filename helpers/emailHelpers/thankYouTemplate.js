const generateThankYouTemplate = () => `
  <!DOCTYPE html>
  <html>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ECECEC; color: #595959;">
      <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #9866C7; color: #fff; text-align: center; padding: 20px; font-size: 24px; font-weight: bold;">
          <img src="../../public/logo.png" alt="GenX Career Logo" style="max-width: 120px; margin-bottom: 10px;">
          <div>Thank You for Contacting GenX Career</div>
        </div>
        <!-- Body -->
        <div style="padding: 30px; background-color: #f9f9f9; font-size: 16px; line-height: 1.8;">
          <p style="margin: 0 0 15px;">Hi,</p>
          <p style="margin: 0 0 15px;">Thank you for reaching out to <strong>GenX Career</strong>. We have received your message and our team will get back to you shortly.</p>
          <p style="margin: 0 0 15px;">We are excited to help you explore IT job opportunities across multiple platforms and assist you with CV generation to match jobs with your skills.</p>
          <p style="margin: 0 0 15px;">Feel free to explore the amazing features on our platform while we respond to your query.</p>
          <p style="margin: 0 0 15px;">If you have additional questions, please don't hesitate to contact us again.</p>
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

export default generateThankYouTemplate;
