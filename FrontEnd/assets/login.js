/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

login = [];


const loginUsers = {
    "email": "sophie.bluel@test.tld",
    "password": "S0phie"
};


const connection = document.getElementById("submit");
const mail = document.getElementById("mail");
const password = document.getElementById("password");


/* ******** */
/* API LIST */
/* ******** */
fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(loginUsers)
})
.then(response => {
    if (!response.ok) {
        throw Error(`${response.status}`)
    }
    return response.json()
})
.then(loginData => {
    login = loginData;
    // loginConnection();
    console.log(login);
})
.catch(error => alert("Erreur : " + error))



