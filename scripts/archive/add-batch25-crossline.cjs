const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "Разведка: ";
const A = " АНТИ-ЛУП.";

function mk(id, role, icon, ac, time, d, tags, diff) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + d + A + '" --completion-promise "DONE"' : d;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty: diff, output: "Result", related: [], prereqs: [], v: "11.2" };
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add = [];

// DEVELOPER CAREER TOPICS (50) — push us cleanly past 10000
const CAREER = [
  'Negotiate Salary Offer','Promotion Case Document','Self-Review Prep','Peer Review Feedback','360 Feedback',
  'Mentor Junior Engineer','Run 1:1 Meeting','Sprint Planning Facilitation','Retrospective Template','Daily Standup Format',
  'Incident Post-Mortem Run','RFC Document Writing','Technical Debt Doc','Architecture Decision Record','Runbook Writing',
  'Onboarding Guide New Hire','Career Ladder Alignment','Skills Gap Analysis','Learning Plan Quarterly','Conference Talk Proposal',
  'Open Source Contribution','Personal Blog Article','Technical Portfolio','Resume Tech Focus','LinkedIn Optimization',
  'Speaking Practice Toastmasters','Interviewing Candidates','Hiring Rubric Creation','Exit Interview','Layoff Conversation',
  'Burnout Recognition','Productivity Systems','Deep Work Setup','Email Inbox Zero','Calendar Management',
  'Focus Time Blocks','Slack Notifications Tame','Async Communication','Documentation Culture','Blameless Culture',
  'Psychological Safety','Feedback Culture','Retrospective Action Items','Team Charter','Team Values Workshop',
  'Remote Team Ritual','Offsite Planning','Team Offsite Agenda','Virtual Coffee Chat','Skip-level 1:1',
  'Engineering Manager Transition'
];
for (const c of CAREER) {
  add.push(mk(`fd-career-${slug(c)}`, c, '◈', '#8b5cf6', '~45m',
    `${c}. Template, скрипт, примеры.`, `career,${slug(c)}`, 'intermediate'));
}

add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, '. Total:', data.P.length);
