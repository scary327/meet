# ZVONILKA 1.0.0

Фронтенд приложение на React + TypeScript + Vite для видеоконференций.

## Технологии

- React 19
- TypeScript
- Vite
- TailwindCSS 4
- LiveKit (видеоконференции)
- React Router
- TanStack Query
- Valtio (state management)

## Разработка

### Локально (без Docker)

```bash
cd src/zvonilka
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

### С Docker (рекомендуется)

```bash
# Из корня проекта
docker compose up zvonilka-dev
```

Приложение будет доступно на `http://localhost:3001`

Hot reload работает через volume mounting.

## Production сборка

### Локально

```bash
cd src/zvonilka
npm run build
npm run preview
```

### С Docker

```bash
# Из корня проекта
docker compose up frontend
```

Приложение будет доступно на `http://localhost:3000`

## Переменные окружения

- `VITE_API_BASE_URL` - URL бэкенда (по умолчанию `http://localhost:8071`)
- `VITE_APP_TITLE` - Название приложения

Файлы окружения:

- `.env.dev` - для локальной разработки
- `.env.prod` - для продакшена

## Структура проекта

```
src/zvonilka/
├── src/
│   ├── app/           # Роутинг и конфигурация приложения
│   ├── components/    # UI компоненты
│   ├── pages/         # Страницы
│   └── shared/        # Общие утилиты, хуки, API
├── public/            # Статические файлы
├── Dockerfile         # Docker конфигурация
├── default.conf       # Nginx конфигурация для production
└── vite.config.ts     # Vite конфигурация
```

## Docker targets

- `zvonilka-dev` - Development режим с hot reload
- `zvonilka-builder` - Сборка production билда
- `zvonilka-production` - Production образ с Nginx

## Default credentials

username: meet
password: meet
