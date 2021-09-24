import LoginComponent from "./components/Login/Login.js"

declare global {
    interface Window {
        Handlebars: any;
    }
}

const login = new LoginComponent()
login.render()
