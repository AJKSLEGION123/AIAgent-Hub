# Maximum Run — 10 ролей, одна сессия

## 🔒 SECURITY (1-5)
- [x] 1. CSP meta tag в index.html
- [x] 2. Sanitize user input в search (уже escaped, verify)
- [x] 3. rel="noopener noreferrer" на все внешние ссылки
- [x] 4. Add integrity check — verify Z data hash after decompress

## 🧪 TESTING (6-8)
- [x] 5. Добавить vitest + первый тест (smoke test — App renders)
- [x] 6. Test: localStorage save/load

## 🔄 REFACTOR (9-12)
- [x] 7. Extract CSS string из JSX в отдельную переменную (CSS const)
- [x] 8. Duplicated "copy all text" pattern → helper function
- [x] 9. Consistent button style helper

## ⚡ PERF (13-15)
- [x] 10. Add will-change: transform на scroll progress bar
- [x] 11. Defer non-critical CSS (print styles)

## ♿ A11Y (16-18)
- [x] 12. Add role="alert" на offline banner
- [x] 13. Add aria-current на active section tab
- [x] 14. Skip link target — verify #main-content exists

## 🚀 FEATURES (19-20)
- [x] 15. Ctrl+/ to toggle compact mode
