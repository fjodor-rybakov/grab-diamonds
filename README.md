# Игра по сбору алмазов(Тестовое задание)

Играют два игрока. Цель найти как можно больше алмазов на карте(отображаются как "*"). Цифра означает возможное кол-во
алмазов в соседних клетках(от 0 до 8)

# Запуск приложения

Установка зависимостей

```bash
npm i
```

Запуск клиента

```bash
npm run dev -w client
```

Запуск сервера

```bash
npm run start:dev -w server
```

## Известные проблемы

В реализации есть много условностей, а так же могут присутствовать баги.

## Планы по развитию

1. Необходимо вынести всю бизнес-логику из `GameEventGateway` в отдельный сервис
2. Привести в порядок клиенскую часть. Сделать разбивку на компоненты, избавиться от прыгающей разметки и т.д.
3. Считывать переменные среды
4. Реализовать сохранение в реальной базе
5. Мигрировать на ecma modules, обновиться до последних версий библиотек, использовать fastify вместо express
6. Покрыть тестами весь код
7. Написать `Dockerfile` и `doсker-compose` файлы для дальнейшего дейплоймента