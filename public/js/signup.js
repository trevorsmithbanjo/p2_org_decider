// variables for DOM elements
const signUpform = document.getElementById('signUpForm')
const orgInputValue = document.getElementById('org-input')
const emailInputValue = document.getElementById('email-input')
const passInputValue = document.getElementById('pass-input')

document.addEventListener("DOMContentLoaded", () => {
    // Event listener for sign up form
    signUpform.addEventListener('submit', (event) => {
        event.preventDefault();
        // Save user Data to a variable
        let userData = {
            org: orgInputValue.value.trim(),
            email: emailInputValue.value.trim(),
            password: passInputValue.value.trim(),
        };
        console.log(userData);
        // If input fields are empty return out of function 
        if (!userData.org || !userData.email || !userData.password) {
            return;
        }
        // Pass user data to the Sign Up Function
        signUpUser(userData.org, userData.email, userData.password);
        // empty the input fields
        orgInputValue.value = "";
        emailInputValue.value = "";
        passInputValue.value = "";

    });

    // Need to set up SignUpUser Function
    signUpUser = (orgName, email, password) => {
        fetch('/api/signup', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json());
            .then((data) => {
            window.location.href = '/dash-home';
        })
            .catch(handleLoginErr);
    }

    signUpUser = () => {
        console.log(err.responseJSON)
    }


});