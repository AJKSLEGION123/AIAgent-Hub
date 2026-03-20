# Overnight Tasks v3 — 100+ задач

## КРИТИЧНО (1-10)
- [x] 1. outline:"none" на 76 кнопках убивает keyboard a11y → добавить :focus-visible стили в CSS
- [x] 2. location.reload() в settings restore — опасно, заменить на state reset
- [x] 3. Нет debounce на scroll handler (scrollPct) — jank на мобильных
- [x] 4. IntersectionObserver не cleanup при unmount (list.length dependency)
- [x] 5. Незакрытые overlays блокируют page scroll (body overflow)

## ВЫСОКИЙ (6-25)
- [x] 6. Добавить prefers-reduced-motion: reduce в CSS animations
- [x] 7. Добавить aria-label на все icon-only buttons (76 штук с outline:none)
- [x] 8. Добавить focus-visible ring в CSS (вместо outline:none)
- [x] 9. Версия в header (v8.0 → v8.1) не совпадает с footer
- [x] 10. Toast не имеет aria-live="polite" для screen readers
- [x] 11. Закрытие модалов по Escape уже есть, но не для всех (showDiff, welcome)
- [x] 12. Table view не показывает difficulty column
- [x] 13. Mobile bottom nav перекрывает footer контент (padding)
- [x] 14. Compare panel не ограничивает grid на 3 колонки при > 3 selected
- [x] 15. Breadcrumbs показывает "..." при search — показать query string

## СРЕДНИЙ (16-40)
- [x] 16. Skeleton loading не pulse без CSS class
- [x] 17. Scroll to top при смене section
- [x] 18. Добавить tabIndex=-1 на модальные окна для focus trap
- [x] 19. Добавить min-height на main content чтобы footer не прыгал
- [x] 20. Print стили: скрыть scroll progress bar
