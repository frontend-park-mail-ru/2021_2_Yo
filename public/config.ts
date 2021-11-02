import { UrlPathnames } from '@/types';

const config = {
    categories: [
        { name: 'Тусовки' },
        { name: 'Выставки' },
        { name: 'Театр' },
        { name: 'Кино' },
        { name: 'Фестивали' },
        { name: 'Экскурсии' },
        { name: 'Концерты' },
        { name: 'Обучение' },
    ],
    authAnchors: [
        { href: UrlPathnames.Login, name: 'Войти' },
        { href: UrlPathnames.Signup, name: 'Регистрация' },
    ],
};

export default config;
