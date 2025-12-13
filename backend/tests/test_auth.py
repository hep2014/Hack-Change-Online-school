import pytest

# ——————————————————————————————
# 1. УСПЕШНАЯ РЕГИСТРАЦИЯ
# ——————————————————————————————

@pytest.mark.asyncio
async def test_register_success(client):
    payload = {
        "firstname": "Илья",
        "lastname": "Матвеев",
        "middlename": "",
        "email": "test@example.com",
        "phone": "89111111111",
        "age": 30,
        "gender": "male",
        "specialization": "Math",
        "password": "StrongP@ssword1",
        "confirm": "StrongP@ssword1",
        "role": "teacher",
    }

    r = await client.post("/auth/register", json=payload)
    assert r.status_code == 200

    data = r.json()
    assert "access" in data
    assert data["role"] == "teacher"
    assert data["email"] == "test@example.com"


# ——————————————————————————————
# 2. ДУБЛИРУЮЩИЙ EMAIL
# ——————————————————————————————

@pytest.mark.asyncio
async def test_register_duplicate_email(client):

    # первый раз — успешно
    p = {
        "firstname": "Илья",
        "lastname": "Матвеев",
        "middlename": "",
        "email": "dup@example.com",
        "phone": "89111111111",
        "age": 25,
        "gender": "male",
        "specialization": "Physics",
        "password": "StrongP@ssword1",
        "confirm": "StrongP@ssword1",
        "role": "teacher",
    }
    await client.post("/auth/register", json=p)

    # второй раз — ошибка
    r2 = await client.post("/auth/register", json=p)
    assert r2.status_code == 401 or r2.status_code == 409

    data = r2.json()
    assert "существует" in data["detail"] or "exists" in data["detail"].lower()


# ——————————————————————————————
# 3. СЛАБЫЙ ПАРОЛЬ
# ——————————————————————————————

@pytest.mark.asyncio
async def test_register_weak_password(client):
    payload = {
        "firstname": "Илья",
        "lastname": "Матвеев",
        "middlename": "",
        "email": "weak@example.com",
        "phone": "89111111111",
        "age": 20,
        "gender": "male",
        "specialization": "IT",
        "password": "qwerty",   # слабый пароль
        "confirm": "qwerty",
        "role": "teacher",
    }

    r = await client.post("/auth/register", json=payload)

    assert r.status_code == 401

    data = r.json()
    assert "пароль" in data["detail"].lower()
