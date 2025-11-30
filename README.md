## Hack-Change Online School 

Полноценная образовательная платформа с React + Vite фронтендом и FastAPI бэкендом, собранная в удобный Docker-монорепозиторий.
## Структура проекта
$$
hakaton/ \\
├── backend/           \\   
│   ├── app/ \\
│   ├── requirements.txt \\
│   └── Dockerfile \\
│ \\
├── frontend/   \\          
│   ├── src/ \\
│   ├── public/ \\
│   ├── package.json \\
│   └── Dockerfile \\
│ \\
├── docker-compose.yml \\
└── Makefile \\
$$
## Запуск проекта
#### Требования
- Docker Engine
- Docker Compose V2
- make (опционально)

#### Запуск с помощью make

Самый удобный способ:
```
make up
```

После запуска:
- Сервис	URL
- Frontend	http://localhost:5173
- Backend	http://localhost:8000
- Swagger	http://localhost:8000/docs

#### Остановка
```
make down
```

#### Перезапуск
```
make restart
```

#### Backend
Стек:
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy 
- Alembic 

#### Frontend
Стек:
- React
- Vite
- TypeScript

Dev сервер автоматически перезапускается при изменениях файлов.

