const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА:\nПрочитай ВЕСЬ проект. Структура, конфиги, зависимости, БД, API, тесты, CI, git log.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 ошибки = смена подхода.";

const add = [
  {id:"rl-supervisor",m:"/ralph-loop",mk:"claude",role:"Project Supervisor",type:"command",icon:"\u{1F575}",ac:"#dc2626",time:"~2-4h",
   text:'/ralph-loop "' + E + 'РОЛЬ: Ты — НАЧАЛЬНИК проекта. Код — твой работник.\n\nЖЕЛЕЗНЫЕ ПРАВИЛА:\n1. НИКОГДА не создавай выходные файлы сам (документы, отчёты, данные). Только проект их создаёт.\n2. Если output неправильный — исправляй КОД проекта, не output.\n3. Каждый фикс ОБЯЗАН быть проверен перезапуском проекта.\n4. Не объявляй готовность без свежего evidence (новый output после фикса).\n\nЦИКЛ:\n1. DISCOVER — изучи проект: entry point, output pipeline, шаблоны-эталоны, зависимости.\n2. RUN — запусти проект с тестовыми/реальными данными.\n3. INSPECT — проверь ВСЕ выходные файлы: структура, данные, форматирование, соответствие шаблонам.\n4. DIAGNOSE — дефект найден? Проследи до конкретной строки кода.\n5. FIX — исправь КОД проекта (минимальное изменение).\n6. VERIFY — перезапусти проект, проверь что дефект исправлен.\n7. ITERATE — повторяй пока 0 дефектов.\n\nINSPECTION CHECKLIST:\n- Документы: структура по шаблону, реквизиты, даты, суммы, суммы прописью.\n- Данные: полнота, расчёты, нет потерь записей.\n- Edge cases: пустые поля, спецсимволы, нули, огромные числа.\n- Нет выдуманных данных — только из входных файлов/БД.\n- Нет плейсхолдеров: {{field}}, TODO, N/A.\n\nDIAGNOSE: output дефект → найди функцию-генератор → прочитай код → найди root cause → классифицируй (template/logic/data/format fix).\n\nREPORT после каждого цикла:\n- Что протестировано\n- Дефекты найдены → файл:строка → статус\n- Фиксы применены\n- Верификация: PASSED/FAILED\n- Quality Score: X/10' + A + '" --completion-promise "ZERO DEFECTS, ALL CHECKS PASS"',
   tags:["qa","supervisor","testing","quality","polish","iterate","verification"],difficulty:"advanced",output:"Polished project with zero defects",related:["rl-tdd","rl-e2e","rl-code-review"],prereqs:[],v:"11.0"},

  {id:"rl-output-qa",m:"/ralph-loop",mk:"claude",role:"Output Quality Gate",type:"command",icon:"\u{1F50D}",ac:"#7c3aed",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Quality Gate для выходных файлов проекта.\n\nТы — инспектор качества. Проект генерирует файлы (документы, отчёты, данные). Ты проверяешь КАЖДЫЙ файл на 100%.\n\nПРАВИЛА:\n- Ты НЕ создаёшь файлы сам. Только проект.\n- Нашёл дефект → исправляешь КОД проекта → перезапускаешь.\n\nCHECKLIST ДЛЯ ДОКУМЕНТОВ (.docx, .pdf):\n1. Структура: все разделы по шаблону?\n2. Реквизиты: БИН/ИНН, адреса, директора — верные?\n3. Даты: формат ДД.ММ.ГГГГ, логика (начало < конец)?\n4. Суммы: цифрами = прописью? Форматирование 1 234 567,89?\n5. Нет плейсхолдеров: {{name}}, [ЗАПОЛНИТЬ], TODO?\n6. Нет выдуманных данных.\n7. Форматирование: шрифты, отступы, таблицы.\n\nCHECKLIST ДЛЯ ДАННЫХ (.xlsx, .csv, .json):\n1. Все записи из входа присутствуют в выходе?\n2. Суммы, итоги, расчёты верны?\n3. Нет дубликатов, нет потерь строк.\n4. Кодировка корректная (UTF-8).\n\nCHECKLIST ДЛЯ СООБЩЕНИЙ (бот, API):\n1. Текст корректный, без обрезки.\n2. Форматирование (HTML/Markdown) валидное.\n3. Все данные из БД, ничего не выдумано.\n\nПри каждом дефекте: НАЙДИ строку кода → ИСПРАВЬ код → ПЕРЕЗАПУСТИ → ПРОВЕРЬ.' + A + '" --completion-promise "ALL FILES PASS QA"',
   tags:["qa","quality-gate","inspection","documents","verification","output"],difficulty:"intermediate",output:"Quality-verified outputs",related:["rl-supervisor","rl-tdd"],prereqs:[],v:"11.0"},

  {id:"rl-auto-polish",m:"/ralph-loop",mk:"claude",role:"Auto-Polish Pipeline",type:"command",icon:"\u{2728}",ac:"#f59e0b",time:"~1-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Автоматическая полировка проекта до идеала.\n\nТы — DevOps-перфекционист. Проходишь проект слой за слоем:\n\nСЛОЙ 1 — РАБОТОСПОСОБНОСТЬ:\n- Проект запускается без ошибок?\n- Все зависимости установлены?\n- .env / config корректные?\n- БД доступна, миграции применены?\n\nСЛОЙ 2 — ФУНКЦИОНАЛЬНОСТЬ:\n- Каждая фича работает?\n- Запусти каждый сценарий, проверь результат.\n- Edge cases: пустые данные, спецсимволы, null.\n\nСЛОЙ 3 — КАЧЕСТВО OUTPUT:\n- Выходные файлы соответствуют шаблонам?\n- Форматирование, данные, расчёты — всё верно?\n- Нет выдуманных данных, плейсхолдеров.\n\nСЛОЙ 4 — УСТОЙЧИВОСТЬ:\n- Обработка ошибок: что будет при плохом вводе?\n- Таймауты, retry, graceful degradation.\n- Логирование: можно ли диагностировать проблему по логам?\n\nСЛОЙ 5 — КОД:\n- Нет дублирования, мёртвого кода.\n- Типизация, docstrings на публичных функциях.\n- Тесты покрывают критический путь.\n\nПРАВИЛО: Ты не создаёшь output сам. Ты чинишь КОД и перезапускаешь проект.\nКАЖДЫЙ фикс = перезапуск + проверка.' + A + '" --completion-promise "ALL 5 LAYERS PASS"',
   tags:["polish","qa","refactor","testing","devops","layers","automation"],difficulty:"advanced",output:"Production-ready project",related:["rl-supervisor","rl-output-qa","rl-tdd","rl-refactor"],prereqs:[],v:"11.0"},

  {id:"rl-template-match",m:"/ralph-loop",mk:"claude",role:"Template Conformity Check",type:"command",icon:"\u{1F4CB}",ac:"#0d9488",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Проверка что проект генерирует документы ТОЧНО по шаблонам.\n\nПРОЦЕСС:\n1. Найди эталонные шаблоны проекта (templates/, examples/, .zip файлы).\n2. Запусти генерацию документа через проект.\n3. Извлеки текст из шаблона и из сгенерированного файла (python-docx, openpyxl).\n4. Сравни СЕКЦИЯ ЗА СЕКЦИЕЙ:\n   - Структура: все разделы на месте, порядок верный?\n   - Формулировки: юридический текст совпадает с шаблоном?\n   - Таблицы: колонки, заголовки, форматирование.\n   - Подписи: формат \"Директор _____________ /ФИО/\".\n   - Реквизиты: блок с БИН, адрес, банк, ИИК.\n5. Расхождения = дефект в КОДЕ генерации.\n6. Исправь код → перезапусти → сравни снова.\n\nВАЖНО:\n- Ты не редактируешь сгенерированный файл — только код генератора.\n- Данные (имена, суммы, даты) ДОЛЖНЫ отличаться — это нормально.\n- СТРУКТУРА и ФОРМУЛИРОВКИ должны совпадать на 100%.\n- Если шаблон .zip — распакуй, изучи все файлы внутри.' + A + '" --completion-promise "TEMPLATE CONFORMITY 100%"',
   tags:["template","conformity","documents","docx","comparison","generation"],difficulty:"intermediate",output:"Template-conformant documents",related:["rl-supervisor","rl-output-qa"],prereqs:[],v:"11.0"},

  {id:"rl-registry-audit",m:"/ralph-loop",mk:"claude",role:"Registry & Data Audit",type:"command",icon:"\u{1F4CA}",ac:"#2563eb",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Аудит обработки реестров/выгрузок данных проектом.\n\nПРОЦЕСС:\n1. Найди входные файлы данных (XLS, CSV, JSON, XML выгрузки из ERP/1C/CRM).\n2. Подсчитай: сколько записей, компаний, документов во входных данных.\n3. Запусти парсер/процессор проекта.\n4. Сверь:\n   - Все записи обработаны (нет потерь)?\n   - Суммы, итоги совпадают?\n   - Группировки корректные?\n   - Дубликаты обработаны?\n5. Запусти анализатор пробелов (если есть):\n   - Все пробелы найдены?\n   - Severity корректная (critical/warning/info)?\n   - Нет ложных срабатываний?\n6. Запусти генератор недостающих документов (если есть):\n   - Все пробелы закрыты?\n   - Документы по шаблону?\n   - Реквизиты верные?\n\nПРИ ДЕФЕКТЕ: исправь код парсера/анализатора/генератора → перезапусти.\nНе исправляй выходные файлы вручную.' + A + '" --completion-promise "AUDIT CLEAN, ZERO DATA LOSS"',
   tags:["registry","audit","data","parsing","1c","erp","gap-analysis"],difficulty:"advanced",output:"Verified data pipeline",related:["rl-supervisor","rl-output-qa","rl-csv-import"],prereqs:[],v:"11.0"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// Combo: Project QA Suite
data.COMBOS.ru.push(
  { name:"Project QA Suite", agents:["rl-supervisor","rl-output-qa","rl-auto-polish","rl-template-match","rl-registry-audit"], ids:["rl-supervisor","rl-output-qa","rl-auto-polish","rl-template-match","rl-registry-audit"], desc:"Полный цикл QA: supervisor + проверка output + полировка + шаблоны + аудит данных" },
);
data.COMBOS.en.push(
  { name:"Project QA Suite", agents:["rl-supervisor","rl-output-qa","rl-auto-polish","rl-template-match","rl-registry-audit"], ids:["rl-supervisor","rl-output-qa","rl-auto-polish","rl-template-match","rl-registry-audit"], desc:"Full QA cycle: supervisor + output check + polish + templates + data audit" },
);

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Prompts:', data.P.length);
console.log('Combos:', data.COMBOS.ru.length);
