const EMPTY_FIELD_PLACEHOLDER = 'Not supplied';

module.exports = {
  getContactClientData(formFields) {
    return {
      from: 'iBuild <no-reply@ibuild.com>',
      to: formFields.email,
      subject: 'iBuild Contact Form Submitted',
      text: `
      Hi ${formFields.name},
      
      You have successfully submitted the contact form with the following details:
      
      Subject: ${formFields.subject || EMPTY_FIELD_PLACEHOLDER}
      Mobile Number: ${formFields.mobile || EMPTY_FIELD_PLACEHOLDER}
      Country: ${formFields.country}
      Message: ${formFields.message}
      
      iBuild Home Loans
      
      `,
      html: `<p>Hi ${formFields.name},</p>
    <p>You have successfully submitted the contact form with the following details:</p>
    <p>
      <strong>Subject:</strong> ${formFields.subject || EMPTY_FIELD_PLACEHOLDER}<br/>
      <strong>Mobile Number:</strong> ${formFields.mobile || EMPTY_FIELD_PLACEHOLDER}<br/>
      <strong>Country:</strong> ${formFields.country}<br/>
      <strong>Message:</strong> ${formFields.message}<br/>
    </p>
    <p>iBuild Home Loans</p>`
    };
  },

  getContactAdminData(formFields) {
    return {
      from: formFields.email,
      to: process.env.CONTENTFUL_ADMIN_EMAIL || 'coenraad@responsive.co.za', // TODO: Update with iBuild admin email
      subject: 'iBuild Contact Form Submitted',
      text: `
      iBuild Contact Form submitted by user.
      
      Details:
      
      Full Name: ${formFields.name}
      Subject: ${formFields.subject || EMPTY_FIELD_PLACEHOLDER}
      Mobile Number: ${formFields.mobile || EMPTY_FIELD_PLACEHOLDER}
      Country: ${formFields.country}
      Message: ${formFields.message}
      
      `,
      html: `<p>iBuild Contact Form submitted by user.</p>
      <h4>Details:</h4>
      <p>
        <strong>Full Name:</strong> ${formFields.name}<br/>
        <strong>Subject:</strong> ${formFields.subject || EMPTY_FIELD_PLACEHOLDER}<br/>
        <strong>Mobile Number:</strong> ${formFields.mobile || EMPTY_FIELD_PLACEHOLDER}<br/>
        <strong>Country:</strong> ${formFields.country}<br/>
        <strong>Message:</strong> ${formFields.message}<br/>
      </p>`
    };
  },

  getApplicationClientData(formFields) {
    return {
      from: 'iBuild <no-reply@ibuild.com>',
      to: formFields.email,
      subject: 'iBuild Application Submitted',
      text: `
      Hi ${formFields.firstName},
      
      You have successfully submitted your application with the following details:
      
      Date of Birth: ${formFields.dateOfBirth || EMPTY_FIELD_PLACEHOLDER}
      Mobile Number: ${formFields.mobileNumber || EMPTY_FIELD_PLACEHOLDER}
      Country: ${formFields.country}
      Email: ${formFields.email}
      
      iBuild Home Loans
      
      `,
      html: `<p>Hi ${formFields.name} ${formFields.surname},</p>
    <p>You have successfully submitted your application with the following details:</p>
    <p>
      <strong>First Name:</strong> ${formFields.name}<br/>
      <strong>Surname:</strong> ${formFields.surname}<br/>
      <strong>Country:</strong> ${formFields.country}<br/>
      <strong>Date of Birth:</strong> ${formFields.dateOfBirth}<br/>
      <strong>Mobile:</strong> ${formFields.mobile || EMPTY_FIELD_PLACEHOLDER}<br/>
      <strong>Email:</strong>  ${formFields.email}<br/>
      <strong>Income Source:</strong> ${formFields.incomeHow}<br/>
      <strong>Company:</strong> ${formFields.company}<br/>
      <strong>Job Title:</strong> ${formFields.jobTitle}<br/>
      <strong>Gross Income:</strong> ${formFields.grossIncome}<br/>
      <strong>Nett Incomet:</strong> ${formFields.nettIncome}<br/>
      <strong>Have Debt:</strong> ${formFields.haveDebt}<br/>
      <strong>Debt Installments:</strong> ${formFields.debtInstallments || EMPTY_FIELD_PLACEHOLDER}<br/>
      <strong>Spouse Salary:</strong> ${formFields.spouseSalary}<br/>
      <strong>Spouse Gross Salary:</strong> ${formFields.spouseGrossSalary || EMPTY_FIELD_PLACEHOLDER}<br/>
      <strong>Project Description:</strong> ${formFields.projectDescription}<br/>
      <strong>Project Town:</strong> ${formFields.projectTown}<br/>
      <strong>Project Suburb:</strong> ${formFields.projectSuburb}<br/>
      <strong>Registered Title:</strong> ${formFields.registeredTitle}<br/>
      <strong>Building Plan:</strong> ${formFields.buildingPlan}<br/>
      <strong>Total Square Meters:</strong> ${formFields.totalSquareMeters || EMPTY_FIELD_PLACEHOLDER}<br/>
      <strong>Construction Started:</strong> ${formFields.constructionStarted}<br/>
      <strong>Construction Stage:</strong> ${formFields.constructionStage || EMPTY_FIELD_PLACEHOLDER}<br/>
      <strong>Loan Estimate:</strong> ${formFields.loanEstimate}<br/>
      <strong>Credit Check:</strong> ${formFields.creditCheck}<br/>
    </p>
    <p>iBuild Home Loans</p>`
    };
  },


  //Application Form
  getApplicationAdminData(formFields) {
    return {
      from: formFields.email,
      to: process.env.CONTENTFUL_ADMIN_EMAIL || 'coenraad@responsive.co.za', // TODO: Update with iBuild admin email
      subject: 'iBuild Application Submitted',
      text: `
      iBuild application submitted by user.
      
      Details:
      
      First Name: ${formFields.name}
      Surname: ${formFields.surname}
      Country: ${formFields.country}
      Date of Birth: ${formFields.dateOfBirth}
      Mobile: ${formFields.mobile}
      Email:  ${formFields.email}
      Income Source: ${formFields.incomeHow}
      Company: ${formFields.company}
      Job Title: ${formFields.jobTitle}
      Gross Income: ${formFields.grossIncome}
      Nett Incomet: ${formFields.nettIncome}
      Have Debt: ${formFields.haveDebt}
      Debt Installments: ${formFields.debtInstallments}
      Spouse Salary: ${formFields.spouseSalary}
      Spouse Gross Salary: ${formFields.spouseGrossSalary}
      Project Description: ${formFields.projectDescription}
      Project Town: ${formFields.projectTown}
      Project Suburb: ${formFields.projectSuburb}
      Registered Title: ${formFields.registeredTitle}
      Building Plan: ${formFields.buildingPlan}
      Total Square Meters: ${formFields.totalSquareMeters}
      Construction Started: ${formFields.constructionStarted}
      Construction Stage: ${formFields.constructionStage}
      Loan Estimate: ${formFields.loanEstimate}
      Credit Check: ${formFields.creditCheck}
      `,
      html: `<p>iBuild application submitted by user.</p>
      <h4>Details:</h4>
      <p>
        <strong>First Name:</strong> ${formFields.name}<br/>
        <strong>Surname:</strong> ${formFields.surname}<br/>
        <strong>Country:</strong> ${formFields.country}<br/>
        <strong>Date of Birth:</strong> ${formFields.dateOfBirth}<br/>
        <strong>Mobile:</strong> ${formFields.mobile || EMPTY_FIELD_PLACEHOLDER}<br/>
        <strong>Email:</strong>  ${formFields.email}<br/>
        <strong>Income Source:</strong> ${formFields.incomeHow}<br/>
        <strong>Company:</strong> ${formFields.company}<br/>
        <strong>Job Title:</strong> ${formFields.jobTitle}<br/>
        <strong>Gross Income:</strong> ${formFields.grossIncome}<br/>
        <strong>Nett Incomet:</strong> ${formFields.nettIncome}<br/>
        <strong>Have Debt:</strong> ${formFields.haveDebt}<br/>
        <strong>Debt Installments:</strong> ${formFields.debtInstallments || EMPTY_FIELD_PLACEHOLDER}<br/>
        <strong>Spouse Salary:</strong> ${formFields.spouseSalary}<br/>
        <strong>Spouse Gross Salary:</strong> ${formFields.spouseGrossSalary || EMPTY_FIELD_PLACEHOLDER}<br/>
        <strong>Project Description:</strong> ${formFields.projectDescription}<br/>
        <strong>Project Town:</strong> ${formFields.projectTown}<br/>
        <strong>Project Suburb:</strong> ${formFields.projectSuburb}<br/>
        <strong>Registered Title:</strong> ${formFields.registeredTitle}<br/>
        <strong>Building Plan:</strong> ${formFields.buildingPlan}<br/>
        <strong>Total Square Meters:</strong> ${formFields.totalSquareMeters || EMPTY_FIELD_PLACEHOLDER}<br/>
        <strong>Construction Started:</strong> ${formFields.constructionStarted}<br/>
        <strong>Construction Stage:</strong> ${formFields.constructionStage || EMPTY_FIELD_PLACEHOLDER}<br/>
        <strong>Loan Estimate:</strong> ${formFields.loanEstimate}<br/>
        <strong>Credit Check:</strong> ${formFields.creditCheck}<br/>
      </p>`
    };
  }
};
