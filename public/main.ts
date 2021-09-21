// Пример импорта компоненты:
// import ComponentName from "./components/name/Name.js"
import {LoginComponent} from "./components/Login/login.js"
import {Request} from "./modules/request.js";

function loginPage() {
    const login = new LoginComponent()
    login.render()
}

loginPage()

// function cookieTest() {
//     fetch('/test', {
//         credentials: "include"
//     }).then(resp => {
//         if (resp.status === 200) {
//             const h1 = document.createElement('h1')
//             h1.textContent = "kfprkgprtg"
//             document.body.innerHTML = ''
//             document.body.appendChild(h1)
//         }
//         loginPage()
//     })
//
// }
//
// cookieTest()