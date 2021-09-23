import LoginComponent from "./components/Login/Login.js"

declare global {
    interface Window {
        Handlebars: any;
    }
}

const signup = new LoginComponent()
signup.render()
