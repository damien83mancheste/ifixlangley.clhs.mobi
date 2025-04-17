													
/*	
																				References

Microsoft. (n.d.). Microsoft Authentication Library for JavaScript (MSAL.js). Microsoft Learn. https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview

Mozilla. (n.d.). Document.getElementById(). MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById

Mozilla. (n.d.). EventTarget.addEventListener(). MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener


Summary: 
															
Script handles user authntication via MIcrosoft Azure AD using MSAL.js
In processMSAL client authenticate suer with Cardinal Langley azure account. When authentication is completed it stores name of user and email address in local storage in form 
of cookies.

Key elements of file are:

- Using MSAL in order to authenticate with Microsoft Azure client
- Deals with login process and redirecting users details
- Automate process where data is populated to form
- Keep user data for length of session inside local storage
- Sign in button is added document.addEventListener("DOMContentLoaded", (),  in order to acomaodate manual sign in. Hopwever at this moment it is afeature which I was planing to
use as backup, but never have to use it , since signing process is happenning automaticaly via redirection.

NOTE: I tried an dmanage use popups approach which worked well, but faced security issues when accessing application on iOS devices, particualry Firefox browser which block
popups, howver redirection approach was sucessfull. It took many attempts and modification of code, untill I managed produce solution compatible with diffrent operating systems. 



*/


const msalConfig = {
  auth: {
    clientId: "3ab29bc2-6660-4995-9837-91a0d5d03a1d",
    authority: "https://login.microsoftonline.com/clrchs.co.uk",
    redirectUri: "https://ifixlangley.clhs.mobi/ICT_booking.html"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

const loginRequest = {
  scopes: ["User.Read"]
};

msalInstance.handleRedirectPromise()
  .then((response) => {
    if (response && response.account) {
      fillUserForm(response.account);
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        fillUserForm(accounts[0]);
      } else {
        msalInstance.loginRedirect(loginRequest);
      }
    }
  })
  .catch((error) => {
    console.error("Redirect error:", error);
  });

function fillUserForm(account) {
  const name = account.name || "";
  const email = account.username || "";

  sessionStorage.setItem("employeeName", name);
  sessionStorage.setItem("employeeEmail", email);

  const nameField = document.getElementById("employee_name");
  const emailField = document.getElementById("email");

  if (nameField) nameField.value = name;
  if (emailField) emailField.value = email;
}

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signInBtn");

  const storedName = sessionStorage.getItem("employeeName");
  const storedEmail = sessionStorage.getItem("employeeEmail");

  if (storedName && storedEmail) {
    const nameField = document.getElementById("employee_name");
    const emailField = document.getElementById("email");
    if (nameField) nameField.value = storedName;
    if (emailField) emailField.value = storedEmail;
  }

  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      msalInstance.loginRedirect(loginRequest);
    });
  }
});
