# Запуск всего проекта
up:
	docker-compose up --build

# Остановка контейнеров
down:
	docker-compose down

# Перезапуск
restart:
	docker-compose down
	docker-compose up --build

# Логи
logs:
	docker-compose logs -f

# Очистить dangling images
clean:
	docker system prune -f

# Собрать только фронт
front:
	docker-compose up --build frontend

# Собрать только бэк
back:
	docker-compose up --build backend

