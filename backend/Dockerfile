FROM python:3.12-slim

# обновление пакетов
RUN apt-get update && apt-get install -y build-essential

# рабочая папка
WORKDIR /app

# копируем зависимости
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# копируем проект
COPY . .

# uvicorn dev server
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
