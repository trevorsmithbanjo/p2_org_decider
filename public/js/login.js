// variables for DOM elements
const logInForm = document.getElementById('loginForm')
const emailInputValue = document.getElementById('email-input')
const passInputValue = document.getElementById('pass-input')

document.addEventListener("DOMContentLoaded", () => {
    // Event listener for sign up form

    logInForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // save user data to a variable
        let userData = {
            email: emailInputValue.value.trim(),
            password: passInputValue.value.trim(),
        };

        console.log(userData);

        // If input fields are empty return out of function 
        if (!userData.email || !userData.password) {
            return;
        }
        // Pass user data to the Log In Function
        logInUser(userData.email, userData.password);
        // empty the input fields
        emailInputValue.value = "";
        passInputValue.value = "";

    });

    // Need to set up Login Function
    logInUser = (email, password) => {
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: `${email}`,
                password: `${password}`,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                response.json()
            })
            .then((data) => {
                window.location.replace("/dashboard")
            })
            .catch(function (err) {
                console.log(err);
            })
    };



});