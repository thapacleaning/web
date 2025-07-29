// ============================================================================
// BNB CLEANERS - COMPLETE GOOGLE APPS SCRIPT SYSTEM
// ============================================================================

// 🔧 CONFIGURATION - UPDATE THESE VALUES
const CONFIG = {
  SPREADSHEET_ID: '1vdxJDV5pDGRiF69GREptO_U6dF_1zrwJiiTbZtSYa-o', // Replace with your actual spreadsheet ID
  OWNER_EMAIL: 'bnbccleaners@gmail.com', // Email to receive notifications
  COMPANY_NAME: 'BNB Cleaners',
  SHEET_NAME: 'Contacts'
};

// ============================================================================
// WEB APP ROUTING
// ============================================================================

/**
 * Handle GET requests - serves admin dashboard (requires Google login)
 */
function doGet(e) {
  try {
    // Check if user is logged in
    const user = Session.getActiveUser().getEmail();
    if (!user) {
      return HtmlService.createHtmlOutput('<h1>Please log in to Google to access this page</h1>');
    }
    
    return HtmlService.createTemplateFromFile('admin')
      .evaluate()
      .setTitle('BNB Cleaners Admin')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (error) {
    console.error('Error in doGet:', error);
    return HtmlService.createHtmlOutput('<h1>Error loading page</h1>');
  }
}

/**
 * Handle POST requests - processes contact form submissions
 */
function doPost(e) {
  try {
    console.log('Received POST request');
    
    const formData = {
      firstName: e.parameter.firstName || '',
      lastName: e.parameter.lastName || '',
      emailAddress: e.parameter.emailAddress || '',
      phoneNumber: e.parameter.phoneNumber || '',
      serviceType: e.parameter.serviceType || '',
      propertyAddress: e.parameter.propertyAddress || '',
      messageContent: e.parameter.messageContent || ''
    };
    
    console.log('Form data:', formData);
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.messageContent) {
      return createResponse({ success: false, message: 'Please fill in all required fields.' });
    }
    
    // Save to spreadsheet
    const result = saveContactToSheet(formData);
    
    if (result.success) {
      // Send email notification
      sendEmailNotification(formData, result.contactId);
    }
    
    return createResponse(result);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse({ success: false, message: 'Server error occurred.' });
  }
}

// ============================================================================
// SPREADSHEET FUNCTIONS
// ============================================================================

/**
 * Initialize spreadsheet with headers and services
 */
function initializeSpreadsheet() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    
    // Create Contacts sheet
    let contactsSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!contactsSheet) {
      contactsSheet = ss.insertSheet(CONFIG.SHEET_NAME);
    }
    
    if (contactsSheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Contact ID', 'First Name', 'Last Name', 'Email', 
        'Phone', 'Service Type', 'Address', 'Message'
      ];
      contactsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = contactsSheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // Create Services sheet
    let servicesSheet = ss.getSheetByName('Services');
    if (!servicesSheet) {
      servicesSheet = ss.insertSheet('Services');
    }
    
    if (servicesSheet.getLastRow() === 0) {
      const serviceHeaders = ['Service Name', 'Price', 'Description'];
      servicesSheet.getRange(1, 1, 1, serviceHeaders.length).setValues([serviceHeaders]);
      
      // Format headers
      const serviceHeaderRange = servicesSheet.getRange(1, 1, 1, serviceHeaders.length);
      serviceHeaderRange.setBackground('#34a853');
      serviceHeaderRange.setFontColor('white');
      serviceHeaderRange.setFontWeight('bold');
      
      // Add default services
      const defaultServices = [
        ['End of Lease Cleaning', 350, 'Comprehensive deep cleaning to ensure full bond return. Includes all rooms, kitchen appliances, bathrooms, windows, and carpet cleaning.'],
        ['Regular House Cleaning', 120, 'Weekly, fortnightly, or monthly house cleaning service. Includes vacuuming, mopping, dusting, bathroom and kitchen cleaning.'],
        ['Deep Cleaning', 280, 'Intensive one-time cleaning service covering all areas of your home including inside appliances, detailed bathroom cleaning, and hard-to-reach areas.'],
        ['Carpet Cleaning', 150, 'Professional carpet steam cleaning and stain removal service. Includes pre-treatment and deodorizing.'],
        ['Window Cleaning', 80, 'Internal and external window cleaning service including frames and sills. Perfect for maintaining pristine views.'],
        ['Airbnb Cleaning', 100, 'Specialized cleaning between guest stays. Quick turnaround service ensuring your property is guest-ready.'],
        ['Office Cleaning', 200, 'Professional commercial cleaning for offices and workspaces. Regular or one-time service available.'],
        ['One-time Cleaning', 150, 'Flexible one-time cleaning service tailored to your specific needs and requirements.']
      ];
      
      servicesSheet.getRange(2, 1, defaultServices.length, 3).setValues(defaultServices);
      
      // Set column widths
      servicesSheet.setColumnWidth(1, 200); // Service Name
      servicesSheet.setColumnWidth(2, 80);  // Price
      servicesSheet.setColumnWidth(3, 400); // Description
    }
    
    console.log('Spreadsheet with services initialized');
    return { success: true, message: 'Spreadsheet and services initialized successfully' };
    
  } catch (error) {
    console.error('Error initializing spreadsheet:', error);
    return { success: false, message: 'Error initializing spreadsheet: ' + error.message };
  }
}

/**
 * Save contact data to spreadsheet
 */
function saveContactToSheet(formData) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Contacts sheet not found. Please run initializeSpreadsheet() first.');
    }
    
    // Generate contact ID
    const contactId = 'C' + Date.now();
    
    // Prepare data
    const rowData = [
      new Date(),
      contactId,
      formData.firstName,
      formData.lastName,
      formData.emailAddress,
      formData.phoneNumber,
      formData.serviceType,
      formData.propertyAddress,
      formData.messageContent
    ];
    
    // Add to sheet
    sheet.appendRow(rowData);
    
    console.log('Contact saved:', contactId);
    return {
      success: true,
      message: 'Thank you for your inquiry! We will contact you within 24 hours.',
      contactId: contactId
    };
    
  } catch (error) {
    console.error('Error saving to sheet:', error);
    return {
      success: false,
      message: 'Error saving your inquiry. Please call us directly at 0460 958 603'
    };
  }
}

/**
 * Get all contacts from spreadsheet
 */
function getAllContacts() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return [];
    }
    
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
    
    // Convert all values to strings to avoid serialization issues
    return data.map(row => ({
      timestamp: row[0] ? row[0].toString() : '',
      contactId: row[1] ? row[1].toString() : '',
      firstName: row[2] ? row[2].toString() : '',
      lastName: row[3] ? row[3].toString() : '',
      email: row[4] ? row[4].toString() : '',
      phone: row[5] ? row[5].toString() : '',
      serviceType: row[6] ? row[6].toString() : '',
      address: row[7] ? row[7].toString() : '',
      message: row[8] ? row[8].toString() : ''
    })).reverse(); // Most recent first
    
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
}

/**
 * Get all services from the Services sheet
 */
function getServices() {
  var SPREADSHEET_ID = '1vdxJDV5pDGRiF69GREptO_U6dF_1zrwJiiTbZtSYa-o'; // Replace with your actual ID
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (!ss) return [];

  var sheet = ss.getSheetByName('Services');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var services = [];

  for (var i = 1; i < data.length; i++) {
    var name = data[i][0];
    var description = data[i][1];
    var price = parseFloat(data[i][2]);
    var active = data[i][3];

    if (active === true || /^yes$/i.test(active) || active === 'TRUE') {
      services.push({
        name: name,
        description: description,
        price: price
      });
    }
  }

  return services;
}

// ============================================================================
// EMAIL NOTIFICATION
// ============================================================================

/**
 * Send email notification to owner about new lead
 */
function sendEmailNotification(formData, contactId) {
  try {
    const subject = `New Lead - ${formData.serviceType} - ${contactId}`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4285f4;">New Lead Details</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f1f3f4;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Contact ID:</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${contactId}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${formData.firstName} ${formData.lastName}</td>
          </tr>
          <tr style="background: #f1f3f4;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${formData.emailAddress}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${formData.phoneNumber}</td>
          </tr>
          <tr style="background: #f1f3f4;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Service:</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${formData.serviceType}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Address:</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${formData.propertyAddress || 'Not provided'}</td>
          </tr>
        </table>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <strong>Message:</strong><br>
          ${formData.messageContent}
        </div>
      </div>
    `;
    
    // Send email with reply-to set to customer's email
    GmailApp.sendEmail(
      CONFIG.OWNER_EMAIL,
      subject,
      '', // Plain text version
      {
        htmlBody: htmlBody,
        name: CONFIG.COMPANY_NAME,
        replyTo: formData.emailAddress // Set reply-to as customer's email
      }
    );
    
    console.log('Email notification sent');
    
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// ============================================================================
// QUOTE AND INVOICE EMAIL FUNCTIONS
// ============================================================================

/**
 * Send quote via email with PDF attachment
 */
function sendQuoteEmail(quoteData) {
  try {
    console.log('Sending quote email:', quoteData);
    
    // Generate quote ID
    const quoteId = 'Q' + Date.now();
    
    // Create quote PDF
    const quotePdf = createQuotePDF(quoteData, quoteId);
    
    // Save PDF to Drive
    const driveFolder = getOrCreateDriveFolder('BNB Cleaners - Quotes');
    const pdfFile = driveFolder.createFile(quotePdf);
    
    // Create personalized email
    const subject = `Quote from BNB Cleaners - ${quoteData.service}`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4285f4, #34a853); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">BNB Cleaners</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Cleaning Services</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${quoteData.customerName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">Thank you for your interest in our cleaning services. Please find your personalized quote for ${quoteData.service} attached.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4285f4;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Quote Summary</h3>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${quoteData.service}</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> $${quoteData.price.toFixed(2)}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
              <h3 style="margin: 0;">Ready to Book?</h3>
              <p style="margin: 5px 0 0 0;">Call us at <strong>0460 958 603</strong></p>
            </div>
          </div>
          
          <div style="border-top: 2px solid #f1f1f1; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
            <p style="margin: 5px 0;"><strong>BNB Cleaners</strong></p>
            <p style="margin: 5px 0;">0460 958 603 | info@bnbcc.com.au</p>
            <p style="margin: 5px 0;">Brisbane North Side, QLD</p>
          </div>
        </div>
      </div>
    `;
    
    // Send email with PDF attachment
    GmailApp.sendEmail(
      quoteData.customerEmail,
      subject,
      '', // Plain text version
      {
        htmlBody: htmlBody,
        attachments: [quotePdf],
        replyTo: 'info@bnbcc.com.au',
        name: 'BNB Cleaners'
      }
    );
    
    console.log('Quote email sent successfully to:', quoteData.customerEmail);
    return { success: true, quoteId: quoteId, pdfFileId: pdfFile.getId() };
    
  } catch (error) {
    console.error('Error sending quote email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send invoice via email with PDF attachment
 */
function sendInvoiceEmail(invoiceData) {
  try {
    console.log('Sending invoice email:', invoiceData);
    
    // Generate invoice ID
    const invoiceId = 'INV' + Date.now();
    
    // Create invoice PDF
    const invoicePdf = createInvoicePDF(invoiceData, invoiceId);
    
    // Save PDF to Drive
    const driveFolder = getOrCreateDriveFolder('BNB Cleaners - Invoices');
    const pdfFile = driveFolder.createFile(invoicePdf);
    
    // Create personalized email
    const subject = `Invoice from BNB Cleaners - ${invoiceData.service}`;
    const dueDate = new Date(invoiceData.dueDate).toLocaleDateString('en-AU');
    
    // Email HTML template
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ffc107, #fd7e14); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">BNB Cleaners</h1>
          <p style="margin: 10px 0 0 0;">Professional Cleaning Services</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${invoiceData.customerName},</h2>
          
          <p style="color: #666; line-height: 1.6;">Thank you for choosing BNB Cleaners. Your invoice is attached.</p>
          
          <div style="background: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Invoice Summary</h3>
            <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${invoiceId}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> $${invoiceData.amount.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
              <h3 style="margin: 0;">Need Assistance?</h3>
              <p style="margin: 5px 0 0 0;">Call us at 0460 958 603</p>
            </div>
          </div>
          
          <div style="border-top: 2px solid #f1f1f1; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
            <p style="margin: 5px 0;"><strong>BNB Cleaners</strong></p>
            <p style="margin: 5px 0;">0460 958 603 | info@bnbcc.com.au</p>
            <p style="margin: 5px 0;">Brisbane North Side, QLD</p>
          </div>
        </div>
      </div>
    `;
    
    // Send email
    GmailApp.sendEmail(
      invoiceData.customerEmail,
      subject,
      '', // Plain text version
      {
        htmlBody: htmlBody,
        attachments: [invoicePdf],
        replyTo: 'info@bnbcc.com.au',
        name: 'BNB Cleaners'
      }
    );
    
    console.log('Invoice email sent successfully to:', invoiceData.customerEmail);
    return { success: true, invoiceId: invoiceId, pdfFileId: pdfFile.getId() };
    
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Create Quote PDF
 */
function createQuotePDF(quoteData, quoteId) {
  const today = new Date().toLocaleDateString('en-AU');
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);
  const validDate = validUntil.toLocaleDateString('en-AU');
  
  const descriptionPoints = quoteData.description.split(',').map(point => 
    point.trim()
  ).filter(point => point.length > 0);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333;
            line-height: 1.4;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #4285f4;
            padding-bottom: 20px;
          }
          .company-name { 
            font-size: 32px; 
            font-weight: bold; 
            color: #4285f4; 
            margin-bottom: 10px;
          }
          .company-details {
            color: #666;
            font-size: 14px;
          }
          .quote-info { 
            display: flex; 
            justify-content: space-between; 
            margin: 30px 0; 
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .customer-details { 
            margin: 30px 0; 
            background: #e8f4fd;
            padding: 20px;
            border-radius: 8px;
          }
          .service-details { 
            margin: 30px 0; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
          }
          th { 
            background: #4285f4;
            color: white;
            padding: 15px; 
            text-align: left; 
            font-weight: bold;
          }
          td { 
            padding: 15px; 
            border-bottom: 1px solid #ddd; 
          }
          .total-row { 
            background: #f8f9fa;
            font-weight: bold; 
            font-size: 18px; 
          }
          .total-amount {
            color: #4285f4;
            font-size: 24px;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            color: #666; 
            border-top: 2px solid #eee;
            padding-top: 20px;
          }
          .terms {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .description-list {
            margin: 0;
            padding-left: 20px;
          }
          .description-list li {
            margin-bottom: 8px;
            color: #555;
          }
          
          .quote-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
          }
          
          .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4285f4;
          }
          
          .info-box h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-box p {
            margin: 5px 0;
            color: #555;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .info-box strong {
            color: #333;
          }
          
          .service-box {
            background: #e8f4fd;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
          }
          
          .service-title {
            color: #0984e3;
            font-size: 20px;
            margin: 0 0 15px 0;
          }
          
          .price-tag {
            font-size: 24px;
            color: #2d3436;
            font-weight: bold;
            margin: 15px 0;
          }
          
          .description-list {
            list-style-type: none;
            padding: 0;
            margin: 20px 0;
          }
          
          .description-list li {
            padding: 8px 0 8px 25px;
            position: relative;
          }
          
          .description-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #4285f4;
          }
        </style>
      </head>
      <body>
        <div class="quote-container">
          <div class="header">
            <div class="company-name">BNB Cleaners</div>
            <div class="quote-details">
              <h2>Quote #${quoteId}</h2>
              <p>Date: ${today}</p>
              <p>Valid Until: ${validDate}</p>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> ${quoteData.customerName}</p>
              <p><strong>Email:</strong> ${quoteData.customerEmail}</p>
              <p><strong>Phone:</strong> ${quoteData.customerPhone || 'Not provided'}</p>
              <p><strong>Address:</strong> ${quoteData.customerAddress || 'Not provided'}</p>
            </div>
            
            <div class="info-box">
              <h3>Quote Information</h3>
              <p><strong>Quote Number:</strong> ${quoteId}</p>
              <p><strong>Issue Date:</strong> ${today}</p>
              <p><strong>Valid Until:</strong> ${validDate}</p>
              <p><strong>Payment Terms:</strong> 50% deposit required</p>
            </div>
          </div>
          
          <div class="service-box">
            <h3 class="service-title">${quoteData.service}</h3>
            <div class="price-tag">$${quoteData.price.toFixed(2)}</div>
            <ul class="description-list">
              ${descriptionPoints.map(point => `
                <li>${point}</li>
              `).join('')}
            </ul>
          </div>
          
          <div class="terms">
            <h4>Terms & Conditions</h4>
            <ul>
              <li>Quote valid for 30 days from issue date</li>
              <li>Service booking subject to availability</li>
              <li>Final price may vary based on site inspection</li>
              <li>50% deposit required to secure booking</li>
              <li>All prices include GST</li>
            </ul>
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Thank you for choosing BNB Cleaners!</p>
            <p>📞 0460 958 603 | ✉️ info@bnbcc.com.au</p>
            <p>🏠 Brisbane North Side, QLD</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  // Create PDF from HTML
  const blob = Utilities.newBlob(htmlContent, MimeType.HTML, "quote.html");
  const pdf = DriveApp.createFile(blob);
  const pdfBlob = pdf.getAs(MimeType.PDF);
  pdf.setTrashed(true);
  
  pdfBlob.setName(`Quote_${quoteId}.pdf`);
  return pdfBlob;
}

/**
 * Create Invoice PDF
 */
function createInvoicePDF(invoiceData, invoiceId) {
  const today = new Date().toLocaleDateString('en-AU');
  const dueDate = new Date(invoiceData.dueDate).toLocaleDateString('en-AU');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif;
            margin: 30px;
            color: #2d3436;
            line-height: 1.4;
            background: #fff;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .company-info {
            flex: 1;
          }
          .company-name {
            font-size: 28px;
            font-weight: 700;
            color: #0984e3;
            margin: 0;
          }
          .company-details {
            color: #636e72;
            font-size: 13px;
            margin-top: 8px;
          }
          .invoice-title {
            text-align: right;
            color: #2d3436;
          }
          .invoice-title h1 {
            font-size: 40px;
            margin: 0;
            color: #0984e3;
          }
          .invoice-meta {
            display: flex;
            justify-content: space-between;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .meta-item {
            flex: 1;
          }
          .meta-item h3 {
            font-size: 12px;
            text-transform: uppercase;
            color: #636e72;
            margin: 0 0 5px 0;
          }
          .meta-item p {
            font-size: 16px;
            margin: 0;
            color: #2d3436;
          }
          .bill-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .bill-to {
            flex: 1;
          }
          .section-title {
            font-size: 14px;
            text-transform: uppercase;
            color: #0984e3;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          .customer-details {
            font-size: 14px;
            color: #636e72;
          }
          .customer-name {
            font-size: 16px;
            color: #2d3436;
            font-weight: 600;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          th {
            background: #f8f9fa;
            padding: 12px 15px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            color: #636e72;
            border-bottom: 2px solid #dfe6e9;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #dfe6e9;
            color: #2d3436;
          }
          .total-section {
            text-align: right;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 2px solid #dfe6e9;
          }
          .total-row {
            font-size: 20px;
            font-weight: 600;
            color: #0984e3;
          }
          .payment-info {
            margin-top: 40px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            font-size: 14px;
          }
          .payment-info h3 {
            color: #0984e3;
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          .payment-details {
            color: #636e72;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="company-info">
              <h1 class="company-name">BNB Cleaners</h1>
              <div class="company-details">
                Professional Cleaning Services<br>
                0460 958 603 | info@bnbcc.com.au<br>
                Brisbane North Side, QLD
              </div>
            </div>
            <div class="invoice-title">
              <h1>Invoice</h1>
              <p>#${invoiceId}</p>
            </div>
          </div>

          <div class="invoice-meta">
            <div class="meta-item">
              <h3>Issue Date</h3>
              <p>${today}</p>
            </div>
            <div class="meta-item">
              <h3>Due Date</h3>
              <p>${dueDate}</p>
            </div>
            <div class="meta-item">
              <h3>Amount Due</h3>
              <p>$${invoiceData.amount.toFixed(2)}</p>
            </div>
          </div>

          <div class="bill-details">
            <div class="bill-to">
              <div class="section-title">Bill To</div>
              <div class="customer-details">
                <div class="customer-name">${invoiceData.customerName}</div>
                ${invoiceData.customerEmail}<br>
                ${invoiceData.customerPhone || 'No phone provided'}<br>
                ${invoiceData.customerAddress || 'No address provided'}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service Description</th>
                <th style="text-align: right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${invoiceData.service}</strong><br>
                  <span style="color: #636e72; font-size: 14px;">
                    ${invoiceData.description}
                  </span>
                </td>
                <td style="text-align: right">$${invoiceData.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              Total Due: $${invoiceData.amount.toFixed(2)}
            </div>
          </div>

          <div class="payment-info">
            <h3>Payment Information</h3>
            <div class="payment-details">
              <strong>Payment Methods:</strong> Bank Transfer, Cash, or Card<br>
              <strong>Reference:</strong> Invoice #${invoiceId}<br>
              <strong>Questions?</strong> Call us at 0460 958 603
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Create PDF from HTML
  const blob = Utilities.newBlob(htmlContent, MimeType.HTML, "invoice.html");
  const pdf = DriveApp.createFile(blob);
  const pdfBlob = pdf.getAs(MimeType.PDF);
  pdf.setTrashed(true);
  
  pdfBlob.setName(`Invoice_${invoiceId}.pdf`);
  return pdfBlob;
}

// ============================================================================
// DRIVE UTILITY FUNCTIONS
// ============================================================================

/**
 * Get or create a folder in Google Drive
 */
function getOrCreateDriveFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    console.log('Creating Drive folder:', folderName);
    return DriveApp.createFolder(folderName);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create standardized response for POST requests
 */
function createResponse(result) {
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Get basic statistics
 */
function getStats() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    const totalContacts = sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
    
    return {
      totalContacts: totalContacts,
      lastUpdated: new Date().toLocaleString('en-AU')
    };
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalContacts: 0,
      lastUpdated: 'Error loading'
    };
  }
}

/**
 * Test function to verify system is working
 */
function testSystem() {
  try {
    // Test spreadsheet access
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    console.log('✅ Spreadsheet accessible');
    
    // Test sheet creation
    const initResult = initializeSpreadsheet();
    console.log('✅ Sheet initialization:', initResult.success);
    
    // Test email (send test notification)
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      emailAddress: 'test@example.com',
      phoneNumber: '0400000000',
      serviceType: 'Test Service',
      propertyAddress: '123 Test St',
      messageContent: 'This is a test message'
    };
    
    sendEmailNotification(testData, 'TEST123');
    console.log('✅ Test email sent');
    
    return { success: true, message: 'All tests passed!' };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, message: 'Test failed: ' + error.message };
  }
}

// ============================================================================
// DEBUG FUNCTION
// ============================================================================

function debugContacts() {
  console.log('=== DEBUGGING CONTACTS ===');
  console.log('CONFIG.SPREADSHEET_ID:', CONFIG.SPREADSHEET_ID);
  console.log('CONFIG.SHEET_NAME:', CONFIG.SHEET_NAME);
  
  try {
    // Test spreadsheet access
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    console.log('✅ Spreadsheet opened successfully');
    console.log('Spreadsheet name:', ss.getName());
    
    // Test sheet access
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    console.log('✅ Sheet found:', !!sheet);
    
    if (!sheet) {
      console.log('❌ Sheet not found. Available sheets:');
      ss.getSheets().forEach(s => console.log('  -', s.getName()));
      return 'Sheet not found';
    }
    
    console.log('Sheet name:', sheet.getName());
    console.log('Total rows:', sheet.getLastRow());
    console.log('Total columns:', sheet.getLastColumn());
    
    if (sheet.getLastRow() <= 1) {
      console.log('❌ No data rows (only headers or empty)');
      return 'No data';
    }
    
    // Get raw data
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9);
    const rawData = dataRange.getValues();
    console.log('Raw data rows:', rawData.length);
    console.log('First row of data:', rawData[0]);
    
    // Test getAllContacts
    const contacts = getAllContacts();
    console.log('getAllContacts returned:', contacts.length, 'contacts');
    if (contacts.length > 0) {
      console.log('First processed contact:', contacts[0]);
    }
    
    return 'Debug complete - check logs';
    
  } catch (error) {
    console.error('❌ Error in debug:', error);
    return 'Error: ' + error.message;
  }
}

console.log('🎉 BNB Cleaners Enhanced System loaded successfully!');
console.log('📋 Available functions:');
console.log('  - initializeSpreadsheet() - Set up your spreadsheet');
console.log('  - testSystem() - Test all components');
console.log('  - getAllContacts() - Get all contact data');
console.log('  - getStats() - Get basic statistics');
console.log('  - debugContacts() - Debug contact loading');
console.log('  - sendQuoteEmail(quoteData) - Send quote with PDF');
console.log('  - sendInvoiceEmail(invoiceData) - Send invoice with PDF');
console.log('  - getServices() - Get services from spreadsheet');
console.log('🚀 New Features:');
console.log('  ✅ Enhanced admin console with search');
console.log('  ✅ Quote generation and email with PDF');
console.log('  ✅ Invoice generation and email with PDF');
console.log('  ✅ Google Drive integration for PDF storage');
console.log('  ✅ Personalized emails with customer info');
console.log('  ✅ Reply-to configured to info@bnbcc.com.au');
console.log('  ✅ Services loaded from Google Sheets');