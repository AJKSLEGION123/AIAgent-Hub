# Agent Hub — Overnight Tasks

## КРИТИЧНО (баги, ломает функционал)

- [x] 1. Исправить `window.storage` API — несуществующий API, настройки НЕ сохраняются. Заменить на `localStorage`
- [x] 2. Удалить мёртвый код: строка 701 `{fm==="model" && fm==="model" && fv!=="all" ? null : null}` — бессмысленное выражение
- [x] 3. Fix search history render: `document.activeElement === searchRef.current` в JSX — антипаттерн, не вызывает re-render при фокусе

## ВЫСОКИЙ (функционал, типизация, UX)

- [x] 4. Обновить `<title>` в index.html — "Agent Hub — Multi-Agent Development System"
- [x] 5. Добавить meta description и OG-теги в index.html
- [x] 6. Удалить неиспользуемые файлы: src/App.css, src/assets/react.svg, public/vite.svg
- [x] 7. Создать SVG favicon для Agent Hub вместо дефолтного Vite
- [x] 8. Добавить `<noscript>` fallback в index.html
- [x] 9. Добавить preconnect для Google Fonts (JetBrains Mono) или встроить шрифт

## СРЕДНИЙ (оптимизация, рефакторинг)

- [x] 10. Добавить CSS `scroll-behavior: smooth` в глобальные стили
- [x] 11. Добавить CSS `::selection` стили для тёмной/светлой темы
- [x] 12. Улучшить loading state — добавить пульсирующую анимацию логотипу
- [x] 13. Добавить manifest.json для PWA-подобного поведения (add to homescreen)
- [x] 14. Оптимизировать index.css — добавить font-display: swap для шрифтов

## НИЗКИЙ (стиль, документация)

- [x] 15. Обновить README.md — описание проекта, скриншот, setup instructions
