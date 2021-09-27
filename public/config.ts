import { UrlPathnames } from "./types.js";
import { signupPage } from "./modules/pageloaders.js";
import { loginPage } from "./modules/pageloaders.js";

export const anchorsConfig = {
    eventAnchors: [
        { href: '/#', name: 'Выставки' },
        { href: '/#', name: 'Концерты' },
        { href: '/#', name: 'Вечеринки' },
        { href: '/#', name: 'Театр' },
        { href: '/#', name: 'Кино' },
        { href: '/#', name: 'Экскурсии' },
        { href: '/#', name: 'Фестивали' },
    ],
    authAnchors: [
        { href: UrlPathnames.Login, name: "Войти" },
        { href: UrlPathnames.Signup, name: "Регистрация" },
    ],
}
