<!-- Этот шаблон автоматически подгрузится в форму PR. Заполните каждую секцию. -->

## Что меняется

<!-- 1-3 предложения. Что и почему. Diff покажет как. -->

## Тип

<!-- Отметьте подходящее (можно несколько) -->

- [ ] feat — новая функциональность пользователю
- [ ] fix — починка бага
- [ ] perf — улучшение производительности
- [ ] refactor — без изменения поведения
- [ ] test — добавлены/изменены тесты
- [ ] docs — документация
- [ ] chore — инфраструктура / deps / CI / build
- [ ] data — изменения в каталоге промтов / комбо / шпаргалок

## Quality gates

<!-- Все обязательны до merge. Запустите локально перед открытием PR. -->

- [ ] `npm run lint` — 0 warnings
- [ ] `npm run typecheck` — clean
- [ ] `npm test` — passing (~242 + ~9 skipped без локального API)
- [ ] `node scripts/check-data.cjs` — `✅ No issues found!`
- [ ] `npm run build` — successful
- [ ] `npm run test:e2e` — все green (если затронут UI)

## Если затронуты данные

<!-- Удалить если не применимо -->

- [ ] Использовал `scripts/add-batch-<topic>.cjs` или `scripts/consolidate-vN.cjs`,
      не редактировал `const Z` напрямую
- [ ] Промт портативен (работает в любом проекте, не AIAgent-Hub-specific)
- [ ] Промт не дублирует существующие per-language/per-cloud
- [ ] Содержит `[AUTONOMY-v4]` wrapper (для `rl-*` / `lp-*`)
- [ ] Скрипт после merge будет перенесён в `scripts/archive/`

## Если затронут UI

<!-- Удалить если не применимо -->

- [ ] Проверил в обеих темах (dark + light)
- [ ] Проверил во всех 3 языках (ru / en / kk)
- [ ] Проверил в 3 viewports (mobile 375 / tablet 768 / desktop 1440)
- [ ] Console clean (zero errors / zero warnings)
- [ ] WCAG AA контраст соблюдён (`textOn()` / `c.onAccent` для текста на акценте)
- [ ] `border-radius ≤ 2px` (editorial palette, не generic SaaS)

## Связанные issues

<!-- "Closes #123" / "Refs #456" -->

## Скриншоты (если визуальные изменения)

<!-- Drag-and-drop в форму PR. Желательно before/after. -->
