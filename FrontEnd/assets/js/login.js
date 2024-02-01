/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

/**Selecting form elements */
const form = document.querySelector(".identifier-form");
const mail = document.getElementById("mail");
const password = document.getElementById("password");

const errorMail = document.querySelector(".error-mail");
const errorPassword = document.querySelector(".error-password");

const btnConnect = document.getElementById("submit");


/* ** ***********************/
/* DECLARATION OF FUNCTIONS */
/* ************************ */

/**Button disabled initially */
function setBtnState(disabled) {
    btnConnect.disabled = disabled;
    btnConnect.style.cursor = disabled ? "not-allowed" : "pointer";
    btnConnect.style.backgroundColor = disabled ? "grey" : "#1D6154";
};
setBtnState(true);

/**Toggle button state based on input */
function toggleSubmitBtn() {
    setBtnState(!(mail.value && password.value));
};


/* ****************************** */
/* DECLARATION OF EVENT LISTENERS */
/* ****************************** */

/**Event listeners for input fields to change button state */
mail.addEventListener("input", toggleSubmitBtn);
password.addEventListener("input", toggleSubmitBtn);


/**Event listener for form submission */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    /**Creating an object with credentials */
    const loginUsers = {
        email: mail.value,
        password: password.value
    };
    
    /**Sending a POST request to the server */
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"},
        body: JSON.stringify(loginUsers)
    })
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`)
        } else {
            /**Hiding error messages if response ok */
            errorMail.style.display = "none";
            errorPassword.style.display = "none";
            return response.json()
        }
    })
    .then(data => {
        /**Change button state, storage of the token and redirection to the index page */
        toggleSubmitBtn();
        localStorage.setItem("token", data.token);
        location.href = "index.html";
    })
    .catch(error => {
        /**Handling errors based on response status */
        if(error.message === "401"){
           errorPassword.style.display = "block";
           errorMail.style.display = "none";
        } else if (error.message === "404"){
            errorMail.style.display = "block";
            errorPassword.style.display = "none";
        } else {
            alert("Erreur : " + error)
        }
    })
})


