const fs = require('fs');
const zlib = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z\s*=\s*"([^"]+)"/);
const data = JSON.parse(zlib.inflateSync(Buffer.from(m[1],'base64')).toString());

data.QUICK_CMDS.ru = [
  { cat: "Разработка", cmds: [
    { cmd: "pnpm dev", label: "Dev сервер" },
    { cmd: "pnpm build", label: "Production билд" },
    { cmd: "pnpm lint", label: "Линтер" },
    { cmd: "npx tsc --noEmit", label: "Typecheck без компиляции" },
    { cmd: "npx prettier --write .", label: "Форматирование кода" },
    { cmd: "pnpm add -D <pkg>", label: "Установить dev-зависимость" },
    { cmd: "npx vite preview", label: "Превью production билда" },
    { cmd: "node --inspect src/server.js", label: "Запуск с дебаггером" },
  ]},
  { cat: "Тестирование", cmds: [
    { cmd: "npx vitest run", label: "Все тесты" },
    { cmd: "npx vitest watch", label: "Тесты в watch-режиме" },
    { cmd: "npx vitest --coverage", label: "Покрытие кода" },
    { cmd: "npx vitest run src/test/file.test.ts", label: "Один файл тестов" },
    { cmd: 'npx vitest -t "test name"', label: "Один конкретный тест" },
    { cmd: "npx playwright test", label: "E2E тесты" },
    { cmd: "npx playwright test --ui", label: "E2E с визуальным UI" },
    { cmd: "npx vitest --update", label: "Обновить снапшоты" },
  ]},
  { cat: "Git", cmds: [
    { cmd: "/commit", label: "Smart commit через Claude" },
    { cmd: "/commit-push-pr", label: "Commit + Push + PR за раз" },
    { cmd: "git stash", label: "Сохранить изменения в стэш" },
    { cmd: "git log --oneline -20", label: "Последние 20 коммитов" },
    { cmd: "git diff --stat", label: "Сводка изменений" },
    { cmd: "git branch -a", label: "Все ветки (local + remote)" },
    { cmd: "git rebase -i HEAD~3", label: "Интерактивный rebase 3 коммитов" },
    { cmd: "git cherry-pick <hash>", label: "Перенести коммит из другой ветки" },
    { cmd: "git bisect start", label: "Бинарный поиск сломанного коммита" },
  ]},
  { cat: "Docker", cmds: [
    { cmd: "docker compose up -d", label: "Запуск в фоне" },
    { cmd: "docker compose down", label: "Остановка" },
    { cmd: "docker compose logs -f", label: "Логи в реалтайме" },
    { cmd: "docker build -t app .", label: "Сборка образа" },
    { cmd: "docker exec -it <id> sh", label: "Зайти в контейнер" },
    { cmd: "docker ps", label: "Список запущенных контейнеров" },
    { cmd: "docker system prune -af", label: "Очистить всё неиспользуемое" },
    { cmd: "docker compose pull && docker compose up -d", label: "Обновить и перезапустить" },
  ]},
  { cat: "Claude Code", cmds: [
    { cmd: "/init", label: "Создать CLAUDE.md для проекта" },
    { cmd: "/feature-dev", label: "Guided разработка фичи" },
    { cmd: '/ralph-loop "задача"', label: "Автономный цикл разработки" },
    { cmd: "/supervise", label: "QA: тестирует, чинит, итерирует до идеала" },
    { cmd: "/review-pr", label: "Мульти-агент ревью PR" },
    { cmd: "/simplify", label: "Упростить и отрефакторить код" },
    { cmd: '/loop 3m "задача"', label: "Мониторинг каждые N минут" },
    { cmd: '/ralph-loop "задача" --completion-promise "DONE"', label: "Автономная задача с гарантией завершения" },
    { cmd: "/brainstorm", label: "Мозговой штурм перед реализацией" },
    { cmd: "/commit-push-pr", label: "Commit + Push + PR одной командой" },
  ]},
  { cat: "Поиск и навигация", cmds: [
    { cmd: 'grep -rn "pattern" src/', label: "Поиск по коду (grep)" },
    { cmd: 'find . -name "*.ts" -not -path "./node_modules/*"', label: "Найти файлы по имени" },
    { cmd: 'rg "pattern" --type ts', label: "Быстрый поиск (ripgrep)" },
    { cmd: 'rg "TODO|FIXME|HACK" src/', label: "Все TODO в проекте" },
    { cmd: "wc -l src/**/*.ts", label: "Подсчёт строк кода" },
    { cmd: "du -sh node_modules/", label: "Размер директории" },
    { cmd: "npx depcheck", label: "Неиспользуемые зависимости" },
    { cmd: "npx madge --circular src/", label: "Циклические зависимости" },
  ]},
  { cat: "npm / pnpm", cmds: [
    { cmd: "pnpm install", label: "Установить зависимости" },
    { cmd: "pnpm outdated", label: "Устаревшие пакеты" },
    { cmd: "pnpm update --latest", label: "Обновить все пакеты" },
    { cmd: "pnpm why <pkg>", label: "Почему установлен пакет" },
    { cmd: "npx npm-check-updates -u", label: "Обновить версии в package.json" },
    { cmd: "pnpm store prune", label: "Очистить кэш pnpm" },
    { cmd: "npm pack --dry-run", label: "Проверить что войдёт в пакет" },
  ]},
  { cat: "Деплой", cmds: [
    { cmd: "vercel", label: "Деплой preview на Vercel" },
    { cmd: "vercel --prod", label: "Деплой production на Vercel" },
    { cmd: "vercel env pull .env.local", label: "Скачать env-переменные" },
    { cmd: "vercel logs <url>", label: "Логи деплоя" },
    { cmd: "npx wrangler deploy", label: "Деплой на Cloudflare Workers" },
    { cmd: 'ssh user@server "cd app && git pull && pm2 restart all"', label: "Деплой на VPS" },
  ]},
];

data.QUICK_CMDS.en = [
  { cat: "Development", cmds: [
    { cmd: "pnpm dev", label: "Dev server" },
    { cmd: "pnpm build", label: "Production build" },
    { cmd: "pnpm lint", label: "Linter" },
    { cmd: "npx tsc --noEmit", label: "Typecheck without compiling" },
    { cmd: "npx prettier --write .", label: "Format code" },
    { cmd: "pnpm add -D <pkg>", label: "Install dev dependency" },
    { cmd: "npx vite preview", label: "Preview production build" },
    { cmd: "node --inspect src/server.js", label: "Start with debugger" },
  ]},
  { cat: "Testing", cmds: [
    { cmd: "npx vitest run", label: "All tests" },
    { cmd: "npx vitest watch", label: "Tests in watch mode" },
    { cmd: "npx vitest --coverage", label: "Code coverage" },
    { cmd: "npx vitest run src/test/file.test.ts", label: "Single test file" },
    { cmd: 'npx vitest -t "test name"', label: "Single specific test" },
    { cmd: "npx playwright test", label: "E2E tests" },
    { cmd: "npx playwright test --ui", label: "E2E with visual UI" },
    { cmd: "npx vitest --update", label: "Update snapshots" },
  ]},
  { cat: "Git", cmds: [
    { cmd: "/commit", label: "Smart commit via Claude" },
    { cmd: "/commit-push-pr", label: "Commit + Push + PR at once" },
    { cmd: "git stash", label: "Stash current changes" },
    { cmd: "git log --oneline -20", label: "Last 20 commits" },
    { cmd: "git diff --stat", label: "Changes summary" },
    { cmd: "git branch -a", label: "All branches (local + remote)" },
    { cmd: "git rebase -i HEAD~3", label: "Interactive rebase 3 commits" },
    { cmd: "git cherry-pick <hash>", label: "Pick commit from another branch" },
    { cmd: "git bisect start", label: "Binary search for broken commit" },
  ]},
  { cat: "Docker", cmds: [
    { cmd: "docker compose up -d", label: "Start in background" },
    { cmd: "docker compose down", label: "Stop" },
    { cmd: "docker compose logs -f", label: "Realtime logs" },
    { cmd: "docker build -t app .", label: "Build image" },
    { cmd: "docker exec -it <id> sh", label: "Enter container shell" },
    { cmd: "docker ps", label: "List running containers" },
    { cmd: "docker system prune -af", label: "Clean all unused" },
    { cmd: "docker compose pull && docker compose up -d", label: "Update and restart" },
  ]},
  { cat: "Claude Code", cmds: [
    { cmd: "/init", label: "Create CLAUDE.md for project" },
    { cmd: "/feature-dev", label: "Guided feature development" },
    { cmd: '/ralph-loop "task"', label: "Autonomous dev loop" },
    { cmd: "/supervise", label: "QA: tests, fixes, iterates until perfect" },
    { cmd: "/review-pr", label: "Multi-agent PR review" },
    { cmd: "/simplify", label: "Simplify and refactor code" },
    { cmd: '/loop 3m "task"', label: "Monitor every N minutes" },
    { cmd: '/ralph-loop "task" --completion-promise "DONE"', label: "Autonomous task with completion guarantee" },
    { cmd: "/brainstorm", label: "Brainstorm before implementation" },
    { cmd: "/commit-push-pr", label: "Commit + Push + PR in one command" },
  ]},
  { cat: "Search & Navigation", cmds: [
    { cmd: 'grep -rn "pattern" src/', label: "Search code (grep)" },
    { cmd: 'find . -name "*.ts" -not -path "./node_modules/*"', label: "Find files by name" },
    { cmd: 'rg "pattern" --type ts', label: "Fast search (ripgrep)" },
    { cmd: 'rg "TODO|FIXME|HACK" src/', label: "All TODOs in project" },
    { cmd: "wc -l src/**/*.ts", label: "Count lines of code" },
    { cmd: "du -sh node_modules/", label: "Directory size" },
    { cmd: "npx depcheck", label: "Unused dependencies" },
    { cmd: "npx madge --circular src/", label: "Circular dependencies" },
  ]},
  { cat: "npm / pnpm", cmds: [
    { cmd: "pnpm install", label: "Install dependencies" },
    { cmd: "pnpm outdated", label: "Outdated packages" },
    { cmd: "pnpm update --latest", label: "Update all packages" },
    { cmd: "pnpm why <pkg>", label: "Why is package installed" },
    { cmd: "npx npm-check-updates -u", label: "Update versions in package.json" },
    { cmd: "pnpm store prune", label: "Clean pnpm cache" },
    { cmd: "npm pack --dry-run", label: "Check what goes into package" },
  ]},
  { cat: "Deploy", cmds: [
    { cmd: "vercel", label: "Preview deploy to Vercel" },
    { cmd: "vercel --prod", label: "Production deploy to Vercel" },
    { cmd: "vercel env pull .env.local", label: "Pull env variables" },
    { cmd: "vercel logs <url>", label: "Deployment logs" },
    { cmd: "npx wrangler deploy", label: "Deploy to Cloudflare Workers" },
    { cmd: 'ssh user@server "cd app && git pull && pm2 restart all"', label: "Deploy to VPS" },
  ]},
];

// Verify
const totalRu = data.QUICK_CMDS.ru.reduce((a,c) => a + c.cmds.length, 0);
const totalEn = data.QUICK_CMDS.en.reduce((a,c) => a + c.cmds.length, 0);
console.log("Categories RU:", data.QUICK_CMDS.ru.length, "| Commands:", totalRu);
console.log("Categories EN:", data.QUICK_CMDS.en.length, "| Commands:", totalEn);
data.QUICK_CMDS.ru.forEach(c => console.log("  " + c.cat + ": " + c.cmds.length));

// Recompress and save
const compressed = zlib.deflateSync(Buffer.from(JSON.stringify(data), 'utf8'));
const b64 = compressed.toString('base64');
const newSrc = src.replace(m[1], b64);
fs.writeFileSync('src/App.jsx', newSrc, 'utf8');
console.log("\n✓ App.jsx updated with expanded QUICK_CMDS");
