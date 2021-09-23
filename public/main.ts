import SignupComponent from "./components/Login/Signup.js"

declare global {
    interface Window {
        Handlebars: any;
    }
}

const signup = new SignupComponent()
signup.render()
