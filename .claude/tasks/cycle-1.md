# Cycle 1 — Качество кода + UX

## КРИТИЧНО
- [x] 1. XSS в export HTML: p.text вставляется через replace но не escape'ит все символы
- [x] 2. CSV export не escape'ит кавычки в данных
- [x] 3. Clipboard fallback (execCommand) deprecated — добавить try/catch message

## ВЫСОКИЙ
- [x] 4. Toast timeout cleanup при unmount (memory leak)
- [x] 5. Добавить loading="lazy" для SVG chart в footer (рендерится всегда)
- [x] 6. Empty workflow state не показывает hint
- [x] 7. Search input не clear'ится при смене section
- [x] 8. Double-click copy не работает в table view (нет onDoubleClick)

## СРЕДНИЙ
- [x] 9. Добавить transition на card expand/collapse
- [x] 10. Добавить hover effect на table rows
- [x] 11. Добавить count badge рядом с favourites star
- [x] 12. Footer "scroll to top" не виден если не скроллили
- [x] 13. Добавить подсказку "?" рядом с shortcuts button
- [x] 14. Improve mobile bottom nav — show active indicator
- [x] 15. Add smooth opacity transition to scroll progress bar
