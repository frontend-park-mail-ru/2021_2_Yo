import { UrlPathnames } from './types.js';

const config = {
    categories: [
        { href: '/#', name: 'Тусовки' },
        { href: '/#', name: 'Выставки' },
        { href: '/#', name: 'Театр' },
        { href: '/#', name: 'Кино' },
        { href: '/#', name: 'Фестивали' },
        { href: '/#', name: 'Экскурсии' },
        { href: '/#', name: 'Концерты' },
        { href: '/#', name: 'Обучение' },
    ],
    authAnchors: [
        { href: UrlPathnames.Login, name: 'Войти' },
        { href: UrlPathnames.Signup, name: 'Регистрация' },
    ],
};

export default config;
