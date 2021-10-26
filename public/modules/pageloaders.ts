// import LoginPageComponent from '../components/LoginPage&SignupPage/LoginPage.js';
// import SignupPageComponent from '../components/LoginPage&SignupPage/SignupPage.js';

// export function loginPage() {
//     const app = document.getElementById('App') as HTMLElement;
//     app.innerHTML = '';
//     const loginController = new LoginController(app);
//     loginController.enable();
// }

// export function signupPage() {
//     const app = document.getElementById('App') as HTMLElement;
//     app.innerHTML = '';
//     const signupController = new SignupController(app);
//     signupController.enable();
// }

export function errorPage(parent: HTMLElement) {
    parent.innerHTML = `
        <h1>ERROR</h1>
        <h2>Котик, ты шото с урлом напутал, давай больше без приколов<3</h2>
    `;
}
