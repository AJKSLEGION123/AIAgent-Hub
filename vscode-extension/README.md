# AIAgent-Hub — VS Code extension

Универсальные [Claude Code](https://docs.claude.com/en/docs/claude-code) промты
прямо в редакторе. **3 299 портативных промтов** + 76 комбо из
[ai-agent-hub.net](https://ai-agent-hub.net), доступны через Quick Pick UI.

## Установка

Локально из исходников (extension не опубликован в Marketplace):

```bash
git clone https://github.com/AJKSLEGION123/AIAgent-Hub.git
cd AIAgent-Hub
# Открыть в VS Code, в Extension Development Host (F5) тестировать
# Или упаковать через vsce + установить .vsix
```

## Команды

| Command | Action |
|---|---|
| `AIAgent-Hub: Search Prompts` (`Ctrl+Shift+A`) | Quick Pick поиск по всем 3 299 промтам с префильтром по `role/desc/text` |
| `AIAgent-Hub: Copy Prompt` | Ввести ID (например `rl-feat`, `lp-247-perfectionist`) → скопировать |
| `AIAgent-Hub: List All Prompts` | Просмотреть все промты в Quick Pick |
| `AIAgent-Hub: Random Prompt` | Случайный промт в clipboard (utility для inspiration) |
| `AIAgent-Hub: Insert Prompt at Cursor` | Quick Pick → вставить промт в текущей позиции редактора |

## Как промты загружаются

Extension читает `src/App.jsx` родительского репо при `activate()` и
декомпрессит `const Z` (zlib + base64) в массив. Это работает только если
extension запущен **внутри клона AIAgent-Hub репозитория** (relative path
`../src/App.jsx`).

Для standalone Marketplace publish потребуется bundle prompts в саму
extension.

## Prompt schema (post-v13)

Каждый промт имеет:

```ts
{
  id: 'rl-foo',          // префикс: rl=ralph-loop, fd=feature-dev,
                         //          lp=loop, rv=review-pr, cr=code-review,
                         //          sm=simplify, cm=commit
  m: '/ralph-loop',
  mk: 'opus47m',         // model: Claude Opus 4.7 · 1M
  role: 'Foo Workflow',
  text: '/ralph-loop "[AUTONOMY-v4]\\n..."',
  desc: 'Краткое описание',
  tags: [...],
  difficulty: 'beginner|intermediate|advanced',
  time: '~2-3h',
  // ...
}
```

См. `CONTRIBUTING.md` родительского репо для full schema.

## Версия

Extension version (см. `package.json`) независима от ai-agent-hub.net
release. Текущая: 0.1.0.

## License

MIT — см. родительский [LICENSE](../LICENSE).
