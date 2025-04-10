// Get verification email HTML template
export function getVerificationEmailTemplate(verificationLink: string) {
    return `
  <!DOCTYPE html>
  <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: "Inter", sans-serif;
        }
  
        /* Container for better email client compatibility */
        .email-container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fccee8;
        }
  
        /* Header section */
        .header {
          padding: 20px;
          padding-bottom: 0;
        }
  
        .logo {
          display: block;
          max-width: 120px;
          margin-bottom: 20px;
          padding: 5px;
          background-color: white;
          border-radius: 10px;
        }
  
        /* Main content */
        .content {
          padding: 0 20px 20px;
          position: relative;
        }
  
        .text-content {
          width: 55%;
          padding-right: 5%;
        }
  
        .headline {
          color: #ac1754;
          font-size: 81px;
          font-weight: bold;
          line-height: 1.1;
          margin: 0 0 10px 0;
          text-align: left;
        }
  
        .subheadline {
          color: #ac1754;
          font-size: 26px;
          font-weight: 500;
          line-height: 1.3;
          margin: 0 0 25px 0;
          text-align: left;
        }
  
        /* Button styling */
        .button-container {
          margin: 25px 0;
          text-align: left;
        }
  
        .button-container .verify-button {
          display: inline-block;
          background-color: #ac1754;
          color: white;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          padding: 12px 30px;
          border-radius: 50px;
          font-size: 16px;
        }
  
        /* Illustration */
        .illustration {
          right: 0px;
          width: 100%;
          max-width: 380px;
        }
  
        .illustration img {
          width: 400px;
          height: auto;
        }
  
        /* Footer */
        .footer {
          background-color: #ac1754;
          color: white;
          padding: 15px;
          text-align: center;
          font-size: 18px;
        }
  
        /* For Outlook and other email clients */
        table {
          border-collapse: collapse;
        }
  
        td {
          padding: 0;
        }
  
        img {
          border: 0;
          display: block;
        }
  
        /* Media query for responsiveness */
        @media screen and (max-width: 480px) {
          .text-content {
            width: 100%;
            padding-right: 0;
          }
  
          .illustration {
            position: static;
            width: 100%;
            max-width: 100%;
            margin: 20px 0;
          }
  
          .headline {
            font-size: 28px;
          }
  
          .subheadline {
            font-size: 16px;
          }
  
          .verify-button {
            display: block;
            width: 80%;
            margin: 0 auto;
            padding: 12px 0;
          }
        }
      </style>
    </head>
    <body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <div class="email-container">
              <!-- Header with logo -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="header">
                    <img src="https://drive.google.com/uc?export=view&id=1HLAAkcrRoYDPoYQeCS_ZsWjGVZYEsTqI" alt="Speak Logo" class="logo" />
                  </td>
                </tr>
              </table>
  
              <!-- Main content with side-by-side layout -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="content">
                    <!-- For email clients that don't support CSS positioning -->
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <tr>
                        <!-- Left side with text -->
                        <td class="text-content" valign="top">
                          <h1 class="headline">HAMPIR<br />SELESAI!</h1>
                          <p class="subheadline">
                            KLIK TOMBOL DI BAWAH<br />UNTUK VERIFIKASI EMAIL.
                          </p>
  
                          <!-- Button -->
                          <div class="button-container">
                            <a 
                              href="${verificationLink}"
                              class="verify-button"
                              >VERIFIKASI</a
                            >
                          </div>
                        </td>
  
                        <!-- Right side with illustration -->
                        <td valign="top" class="illustration">
                          <img
                            src="https://drive.google.com/uc?export=view&id=1IV6dMxarbnPJAQcZi6_80sAOyM0KHI1U"
                            alt="Verification Illustration"
                            width="240"
                          />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
  
              <!-- Footer -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="footer">
                    Hak Cipta © 2025 SPEAK. Seluruh Hak Cipta Dilindungi.
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
    `;
  }