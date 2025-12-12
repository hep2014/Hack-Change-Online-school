# HackChange Online School — MVP онлайн-школы

**Полноценный MVP** онлайн-школы, разработанный в рамках хакатона **HackChange**.  
Проект объединяет современный фронтенд, продуманную backend-архитектуру, безопасность и контейнеризацию в единый воспроизводимый стек. 

## Команда проекта
- **Матвеев Илья** — backend, frontend, архитектура, бизнес-логика, идея проекта, контейнеризация, безопасность  
  Telegram: **[@hep2014](https://t.me/hep2014)**
- **Кабанова Анастасия** — frontend: визуальная концепция, стили, структура и содержание страниц  
  Telegram: **[@anastaness](https://t.me/anastaness)**

## О проекте

Проект реализует **полноценный MVP онлайн-школы**, включающий:

- **Главную страницу онлайн-школы**
- **Личный кабинет преподавателя**, в котором доступно:
  - создание заданий
  - выгрузка файлов работ студентов
  - проверка и выставление оценок
  - просмотр персональной статистики
- **Авторизация и безопасность уровня production**
- **Интеграция с Telegram** для восстановления доступа

Проект изначально проектировался как масштабируемый и готовый к дальнейшему развитию.

## Планы развития

- Личный кабинет студента
- Хостинг и деплой на домене `.tech`
- Метрики и мониторинг (Prometheus + Grafana)
- Централизованное логирование (ELK / Kibana)

## Архитектура и стек технологий

### Backend
- **FastAPI**
- **SQLAlchemy (async)**
- **Alembic** — миграции БД
- **JWT (access / refresh tokens)**
- **argon2-cffi** — хэширование паролей
- **logging** — структурированное логирование

### Frontend
- **Vite + React**
- Современная компонентная архитектура
- Анимации, динамические элементы, интерактивный UI

### Инфраструктура
- **Docker + Docker Compose**
- PostgreSQL внутри docker-сети
- Автоматическое применение миграций
- Изолированные сервисы (backend / frontend / telegram)

### Интеграции
- **Telegram Bot API** — восстановление пароля

## Безопасность

Безопасность была одним из ключевых приоритетов проекта.
Реализовано:
- **Хэширование паролей с использованием argon2**
  - пароль **никогда не хранится в открытом виде**
  - используется соль
- **Сброс пароля через Telegram**
  - дополнительный фактор, привязанный к chat_id
- **Защита от брутфорса**
  - отдельная таблица failed_logins
  - экспоненциальный backoff при повторных попытках входа
- **JWT-авторизация**
  - access-токен хранится в `localStorage`
  - refresh-токены вынесены в отдельную таблицу
- Четкое разделение ролей и прав доступа

## Frontend — визуальная часть

Интерфейс проекта — это не «типовой шаблон», а продуманный дизайн:

- **Тёмно-зелёная цветовая палитра**
- **Неоновые акценты и вспышки**
- **Анимации и плавные переходы**
- Современная компоновка страниц

Frontend создаёт ощущение живого продукта, а не технического прототипа.

## Backend — best practices

Backend построен с упором на читаемость, расширяемость и поддержку:

- Чёткое разделение на:
  - **роутеры**
  - **сервисы**
  - **модели**
  - **Pydantic-схемы**
  - **ядро приложения**
  - **утилиты**
- Отсутствие «бизнес-логики в ручках»
- Подготовка к масштабированию и добавлению новых ролей

## Логирование и наблюдаемость

Реализовано:
- Структурированное логирование через `logging`
- Логи успешных действий и ошибок
- Разделение по уровням (`INFO`, `ERROR`)

В планах:
- Prometheus
- Grafana
- Kibana / централизованный сбор логов

## Структура проекта

```
hakaton/
├── backend/ # FastAPI backend
├── frontend/ # Vite + React frontend
├── telegram/ # Telegram-бот
├── docker/
│ └── db/init/ # SQL-инициализация БД
├── docker-compose.yml
├── .env.example # пример конфигурации окружения
└── README.md
```

## Установка и запуск

### Требования
- Docker
- Docker Compose

### Быстрый старт

```
docker compose up --build
```
После запуска:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Swagger**: http://localhost:8000/docs

## Конфигурация (.env.example)

Файл .env.example содержит шаблон переменных окружения, необходимых для запуска:
- параметры подключения к БД
- секреты JWT
- настройки argon2
- токен Telegram-бота
- режим приложения (APP_ENV)
Структура:
```
DB_HOST= # здесь помещается хост, на котором запускается база данных. В случае с контейнерами = db
DB_PORT= # здесь помещается порт, на котором запускается база данных. В случае с контейнерами = 5432
DB_USER= # здесь помещается пользователь базы данных. 
DB_PASSWORD= # здесь помещается пароль выбранного пользователя
DB_NAME= # в случае с нашим контейнером, DB_NAME=onlineschool
TELEGRAM_BOT_TOKEN= # токен для telegram-бота, который помогает в восстановлении пароля
ARGON2_TIME_COST= # параметр для argon2-cffi
ARGON2_MEMORY_COST= # параметр для argon2-cffi
ARGON2_PARALLELISM= # параметр для argon2-cffi
SECRET_KEY= # здесь помещается секретный ключ для формирования JWT-токена
HASH_SCHEME= # здесь так же помещается секретный хэш для формирования JWT-токена
APP_ENV=production # формат запуска приложения
```
Для запуска:
- Скопировать .env.example → .env
- Заполнить значения
```
cp .env.example .env
```

## QA-подход и тестирование
В проекте реализован QA-подход к backend-разработке: ключевая бизнес-логика аутентификации покрыта автоматическими тестами.
Тесты проверяют:
- корректную регистрацию пользователей,
- защиту от дублирующих email,
- валидацию и отказ для слабых паролей,
- корректность HTTP-статусов и ответов API.
Тесты написаны на pytest + pytest-asyncio и работают напрямую с FastAPI-приложением.
### Структура:
```
backend/
└── tests/
    └── tests_auth.py
```
### Примеры тестируемых сценариев:
- test_register_success
- test_register_duplicate_email
- test_register_weak_password
Тесты используют асинхронный HTTP-клиент и полностью повторяют реальные сценарии работы frontend → backend.
### Изоляция тестовой среды 
Изоляция тестовой среды
Для тестов используется отдельная тестовая база данных:
- production БД: onlineschool
- test БД: school-test
Тестовая БД:
- поднимается автоматически в conftest.py,
- не требует alembic-миграций,
- полностью изолирована от production-данных.
Это гарантирует:
- безопасность данных,
- воспроизводимость тестов,
- возможность запускать тесты сколько угодно раз.
### Запуск тестов через Docker 
Backend Dockerfile уже полностью готов для запуска тестов.
Запуск: 
```
docker compose run --rm backend pytest
```
## Примеры работы с API (curl)
Ниже приведены примеры curl-запросов для основных ручек backend API.
Все запросы предполагают, что backend запущен по адресу:
```
http://localhost:8000
```
### Аутентификация (/auth)
Запрос:
```
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Имя",
    "lastname": "Фамилия",
    "middlename": "Отчество",
    "email": "teacher@example.com", # тестовый email
    "phone": "+79990000000", # тестовый телефон
    "age": 22, # от 18 до 100
    "gender": "male", # 'male', 'female'
    "password": "StrongPassword123!", # Пароль от 8 до 32 символов
    "role": "teacher", # роль - по дефолту 'teacher' - будет расширено позже
    "specialization": "Backend development" 
  }'
```
Ответ: 
```
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer"
}
```
### Логин (/login)
Запрос: 
```
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "StrongPassword123!"
  }'
```
### Логаут (/logout) - удаление refresh-токена 
Запрос: 
```
curl -X POST http://localhost:8000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<REFRESH_TOKEN>"
  }'
```
### Проверка, занят ли email (/check-email)
Запрос:
```
curl "http://localhost:8000/auth/check-email?email=teacher@example.com"
```
Ответ:
```
{
  "exists": true
}
```
### Сброс пароля через Telegram (/reset-password)
Запрос: 
```
curl -X POST http://localhost:8000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "chat_id": 123456789
  }'
```
Новый пароль будет отправлен в Telegram.

#### Все запросы ниже требуют Authorization-заголовок:
Authorization: Bearer <ACCESS_TOKEN>

### Получение статистики преподавателя (/teacher-stat)
Запрос:
```
curl http://localhost:8000/teacher/stats \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```
### Создание задания (assignments/create)
Запрос: 
```
curl -X POST http://localhost:8000/teacher/assignments/create \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Лабораторная работа №1",
    "type": "Домашнее задание",
    "deadline": "2025-12-31",
    "description": "Реализовать REST API",
    "courseid": 1
  }'
```
### Скачать файл задания (/assignments/{id}/file)
Запрос: 
```
curl -X GET http://localhost:8000/teacher/assignments/1/file \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -o assignment.zip
```
### Выставить оценку за задание (/assignments/result)
Запрос: 
```
curl -X POST http://localhost:8000/teacher/assignments/result \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentid": 1,
    "studentid": 5,
    "grade": 5,
    "comment": "Отличная работа"
  }'
```
### Получить список преподавателей (/list)
Запрос: 
```
curl http://localhost:8000/teacher/list
```
---
Проект HackChange Online School на текущем этапе представляет собой полностью работоспособный MVP, архитектурно подготовленный к дальнейшему развитию и масштабированию. Уже сейчас он демонстрирует целостный подход к разработке: от идеи и UX до backend-логики, безопасности, контейнеризации и автоматического тестирования.
Полученные в ходе работы над проектом навыки — проектирование API, реализация безопасной аутентификации, разделение логики на сервисы, использование миграций, работа с Docker, внедрение логирования и QA-подхода — формируют прочную инженерную базу для создания современных, устойчивых и прогрессивных приложений.
