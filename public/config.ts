import { signupPage } from "./modules/pageloaders.js";
import { loginPage } from "./modules/pageloaders.js";

export const anchorsConfig = {
    eventAnchors: [
        { key: "", href: "/#", name: "Выставки" },
        { key: "", href: "/#", name: "Концерты" },
        { key: "", href: "/#", name: "Вечеринки" },
        { key: "", href: "/#", name: "Театр" },
        { key: "", href: "/#", name: "Кино" },
        { key: "", href: "/#", name: "Экскурсии" },
        { key: "", href: "/#", name: "Фестивали" },
    ],
    authAnchors: [
        { key: "login", href: "/login", name: "Войти" },
        { key: "signup", href: "/signup", name: "Регистрация" },
    ],
}

export const pagesConfig = {
    login: loginPage,
    signup: signupPage,
}
