<div style="text-align:center">

<a href="https://bmstusa.ru" rel="noopener">

<img src="https://bmstusa.ru/images/91375b53-227d-47e8-be8d-195835beb520.webp"  alt="Project logo"></a>

</div>

<h2  align="center">BMSTUSA </h2>
<h3  align="center">Молодёжный сервис для агрегирования мероприятий для вас и ваших друзей<h4>
  

<div  align="center">


  

## 📝 Table of Contents

  

-  [О проекте](#about)

-  [Запуск приложения](#getting_started)

-  [Деплой](#deployment)

-  [Использование](#usage)

-  [Сервисы](#built_using)

-  [Авторы](#authors)

-  [Отдельное спасибо](#acknowledgement)

-  [Frontend](#frontend)

  

## 🧐 About <a name = "about"></a>

  Высокая нагрузка, неинтересные или сложные предметы, невозможность отвлечься и найти себе интересную компанию постепенно приводят к выгоранию. К счастью, есть много разных способов, чтобы снять стресс от учебы, одним из них традиционно является провождение времени в компании интересных людей. Нашей целью было создать сервис, который поможет студентам выбрать, как именно провести им это время.



  

## 🏁 Getting Started <a name = "getting_started"></a>

  

Эти инструкции помогут тебе разобраться, как запустить наше приложение на своей машине. Смотри [Деплой](#deployment) , чтобы увидеть как проект выглядит в живую.

  

### Зависимости

  
Установи это обязательно, для запуска приложения у себя

  

```
📸 libwebp
🐳 docker
🐳 docker-compose
🗄 postgresql (Либо запусти БД в 🐳docker)
```

  

### Запуск

  
Пошаговая инструкция, как запустить приложение у себя

  
Запусти  Postgresql. Ниже пример, как запустить при помощи 🐳docker
```
docker run --name=bmstusa-db -e POSTGRES_PASSWORD='<your_password>' -p 5432:5432 --rm -d postgres
```
Укажи необходимые параметры для подключения БД в config.yml. Если использовал пункт выше, то достаточно указать localhost в поле host у postgres_db. А пароль необходимо записать в переменные окружения. Можешь создать файл .env в корневой директории проекта и указать там.
```
POSTGRES_PASSWORD=<your_password>
``` 
Если хочешь использовать возможности приложения по максимуму, то надо будет воспользоваться 📍 dadata API, https://dadata.ru/api/geolocate/, и записать переменную окружения. Так ты сможешь использовать карты в приложении.
```
MAPS_TOKEN=<your_token>
``` 
Запусти docker-compose.yml. Для хранения картинок можешь указать свой путь в поле device: /your_dir
```
docker-compose up -d
```
Готово.

  

## 🔧 Запуск тестов <a name = "tests"></a>

  

В Makefile мы записали короткую команду, чтобы ты мог прогнать все тесты и посмотреть покрытие
```
make cover
```

  

### Linter
Мы используем golangci-lint, для его запуска можешь написать данные команды.
```
curl -sfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh| sh -s -- -b $(go env GOPATH)/bin v1.40.0
$(go env GOPATH)/bin/golangci-lint run
```

  

## 🎈 Использование <a name="usage"></a>
С помощью нашего сервиса ты можешь записываться на мероприятия, создавать их, приглашать своих друзей на всевозможные выставки, концерты, спектакли. Это позволит вам проводить больше времени вместе так ещё и веселее.
  

## 🚀 Деплой <a name = "deployment"></a>
Ссылка на деплой: https://bmstusa.ru
## ⛏️ Сервисы<a name = "built_using"></a>

[PostgreSQL](https://www.postgresql.org/) - Database

[Redis](https://redis.io/) - Database

[Nginx](https://nginx.org/ru/) - Proxy server

[Go](https://go.dev/) - Language

[Docker](https://www.docker.com/) - Containers

  

## ✍️ Авторы <a name = "authors"></a>

  

-  [@zdesbilaksenia](https://github.com/zdesbilaksenia) - Никитина Ксения [Team Lead, Frontend]
-  [@just4n4cc](https://github.com/just4n4cc) - Корчевский Александр [Frontend]
-  [@technoyo](https://github.com/comradyo) - Винников Степан [Backend]
-  [@sarpolman](https://github.com/a-shirshov) - Ширшов Артём [Backend]

 
## 🎉 Отдельное спасибо <a name = "acknowledgement"></a>

Наши менторы: Куклин Сергей, Манзеев Николай

Преподаватели

Вся команда Технопарк VK. Это был замечательный семестр

## 🎉 Frontend <a name = "frontend"></a>
https://github.com/frontend-park-mail-ru/2021_2_Yo