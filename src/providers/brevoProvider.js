import * as Brevo from '@getbrevo/brevo'
import { env } from '~/config/environment'

const apiInstance = new Brevo.TransactionalEmailsApi()
apiInstance.authentications['apiKey'].apiKey =

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  try {
    const sendSmtpEmail = {
      sender: {
        email: 'boint99@gmail.com',
        name: env.ADMIN_EMAIL_NAME
      },
      to: [{ email: recipientEmail }],
      subject: customSubject,
      htmlContent: htmlContent
    }

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email sent successfully:', response)
    return response
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const brevoProvider = { sendEmail }
