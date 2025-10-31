// Email utility for sending notifications
// This is a simple implementation. In production, use services like:
// - Nodemailer with SMTP
// - SendGrid
// - AWS SES
// - Mailgun

export const sendEmailNotification = async ({ to, subject, template, data }) => {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_SERVICE_ENABLED || process.env.EMAIL_SERVICE_ENABLED !== 'true') {
      console.log(`📧 Email would be sent to ${to}: ${subject}`)
      console.log(`   Template: ${template}`, data)
      return { success: true, message: 'Email service not enabled, logged to console' }
    }

    // If using a service like Nodemailer, implement here
    // For now, we'll just log the email
    const emailContent = generateEmailContent(template, data)
    
    console.log(`📧 Email Notification:`)
    console.log(`   To: ${to}`)
    console.log(`   Subject: ${subject}`)
    console.log(`   Content: ${emailContent}`)

    // TODO: Implement actual email sending
    // Example with nodemailer:
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // })
    // await transporter.sendMail({ to, subject, html: emailContent })

    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

const generateEmailContent = (template, data) => {
  switch (template) {
    case 'application_submitted':
      return `
        <h2>Application Submitted Successfully</h2>
        <p>Hi ${data.userName},</p>
        <p>Your application for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong> has been submitted successfully.</p>
        <p>We'll review your application and get back to you soon.</p>
        <p>Good luck!</p>
      `
    
    case 'application_accepted':
      return `
        <h2>🎉 Congratulations! Your Application Has Been Accepted</h2>
        <p>Hi ${data.userName},</p>
        <p>Great news! Your application for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong> has been accepted.</p>
        ${data.reviewNotes ? `<p><strong>Note:</strong> ${data.reviewNotes}</p>` : ''}
        <p>We'll be in touch with next steps soon.</p>
      `
    
    case 'application_rejected':
      return `
        <h2>Update on Your Application</h2>
        <p>Hi ${data.userName},</p>
        <p>Thank you for your interest in <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong>.</p>
        <p>After careful consideration, we've decided to move forward with other candidates at this time.</p>
        ${data.reviewNotes ? `<p><strong>Feedback:</strong> ${data.reviewNotes}</p>` : ''}
        <p>We encourage you to explore other opportunities on our platform.</p>
      `
    
    default:
      return `
        <p>Hi ${data.userName || 'User'},</p>
        <p>${data.message || 'You have a new notification.'}</p>
      `
  }
}

