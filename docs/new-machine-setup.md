# New Machine Setup (Antigravity + Docker + GitHub)

Ниже пошаговая инструкция для нового компьютера, чтобы продолжить разработку проекта `Auto-game`.

## Шаг 1. Подготовить базовые инструменты

1. Установить `Git`.
2. Установить `Docker Desktop` (или Docker Engine + Compose).
3. Установить `Node.js 20 LTS` (если планируется локальный запуск без Docker).
4. Установить `Antigravity` (из вашего стандартного источника/инструкции команды).

Проверка:

```bash
git --version
docker --version
docker compose version
node -v
```

## Шаг 2. Создать рабочую папку

```bash
mkdir -p ~/Projects
cd ~/Projects
```

## Шаг 3. Настроить SSH-ключ для GitHub

1. Сгенерировать ключ:

```bash
ssh-keygen -t ed25519 -C "auto-game-dev" -f ~/.ssh/id_ed25519_auto_game
```

2. Запустить агент и добавить ключ:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_auto_game
```

3. Скопировать публичный ключ:

```bash
cat ~/.ssh/id_ed25519_auto_game.pub
```

4. Добавить ключ в GitHub:
`GitHub -> Settings -> SSH and GPG keys -> New SSH key`.

5. Проверить доступ:

```bash
ssh -T git@github.com
```

## Шаг 4. Клонировать репозиторий

```bash
cd ~/Projects
git clone git@github.com:fido2465724100-creator/Auto-game.git
cd Auto-game
git checkout DEV
git pull origin DEV
```

## Шаг 5. Проверить локальные конфиги

1. Убедиться, что есть файлы:
- `docker-compose.yml`
- `Dockerfile`
- `.dockerignore`

2. Проверить, что нужные порты свободны или не конфликтуют:
- web: `3100`
- api: `4100`
- db: `55432`

Проверка:

```bash
lsof -nP -iTCP -sTCP:LISTEN | egrep ':(3100|4100|55432)'
```

## Шаг 6. Запустить проект в Docker

```bash
docker compose down --remove-orphans
docker compose up -d --build
```

Проверить контейнеры:

```bash
docker compose ps
```

Ожидается:
- `auto-tycoon-db` — healthy
- `auto-tycoon-api` — up
- `auto-tycoon-web` — up

## Шаг 7. Проверить приложение

1. Открыть в браузере: `http://localhost:3100`
2. Проверить API:

```bash
curl http://localhost:4100/game/state
```

## Шаг 8. Если деплой/хостинг (Render)

Для web-сервиса обязательно задать:

```bash
NEXT_PUBLIC_API_URL=https://<ваш-api-домен>.onrender.com
```

Иначе браузер может блокировать запросы (mixed content).

## Шаг 9. Ежедневный workflow

```bash
cd ~/Projects/Auto-game
git checkout DEV
git pull origin DEV
# работа
git add -A
git commit -m "your message"
git push origin DEV
```

## Шаг 10. Частые проблемы

1. `Permission denied (publickey)`:
- ключ не добавлен в GitHub;
- не тот ключ загружен в ssh-agent.

2. Порт занят:
- поменять host-порты в `docker-compose.yml`.

3. Docker завис на `npm install`:
- подождать первый билд (может быть долгим);
- проверить интернет и ресурсы Docker Desktop.

4. Web не видит API на хостинге:
- проверить `NEXT_PUBLIC_API_URL`.
