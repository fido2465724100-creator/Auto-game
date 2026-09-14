#!/usr/bin/env bash

# Set directory
PROJECT_DIR="/home/anton/Projects/Auto-game"
cd "$PROJECT_DIR" || exit 1

# Load NVM & Node.js environment
export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "====================================================="
echo "   🚗  Auto Industry Tycoon - Запуск игры"
echo "====================================================="
echo ""

# Free up ports 4000 and 3000 if already occupied by previous run
fuser -k 4000/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
sleep 1

# Trap cleanup on exit
cleanup() {
    echo ""
    echo "Останавливаем серверы..."
    kill $API_PID $WEB_PID 2>/dev/null
    fuser -k 4000/tcp 2>/dev/null
    fuser -k 3000/tcp 2>/dev/null
    echo "Серверы остановлены. До свидания!"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Build shared game-engine if needed
npm --workspace @ait/game-engine run build >/dev/null 2>&1

# 1. Start API Backend
echo "[1/3] Запуск API бэкенда (порт 4000)..."
npm run dev:api > /tmp/auto-game-api.log 2>&1 &
API_PID=$!

# 2. Start Web Frontend
echo "[2/3] Запуск Web интерфейса (порт 3000)..."
npm run dev:web > /tmp/auto-game-web.log 2>&1 &
WEB_PID=$!

# 3. Wait for Web to be ready
echo "[3/3] Ожидание готовности сервера..."
READY=0
for i in {1..35}; do
    if curl -s -o /dev/null http://localhost:3000/vehicle-design; then
        READY=1
        break
    fi
    sleep 1
    printf "."
done

echo ""
if [ $READY -eq 1 ]; then
    echo "✓ Серверы готовы!"
    echo "Открываем браузер: http://localhost:3000/vehicle-design"
    xdg-open "http://localhost:3000/vehicle-design" >/dev/null 2>&1 &
else
    echo "Предупреждение: Сервер еще загружается, открываем браузер..."
    xdg-open "http://localhost:3000/vehicle-design" >/dev/null 2>&1 &
fi

echo ""
echo "====================================================="
echo " Игра запущена и работает в браузере!"
echo " Чтобы остановить игру, закройте это окно"
echo " или нажмите Ctrl + C"
echo "====================================================="
echo ""

# Keep running until window is closed or Ctrl+C
wait
