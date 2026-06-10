const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/articles.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Update interface definition
content = content.replace(
  '  time: string;\n  author: string;',
  '  time: string;\n  datePublished: string;\n  dateModified: string;\n  author: string;'
);

const refDate = new Date("2026-06-10T19:00:00.000Z"); // current date/time context

function parseTimeToDate(timeStr) {
  let minutesAgo = 0;
  if (timeStr === 'לפני דקה') {
    minutesAgo = 1;
  } else if (timeStr.startsWith('לפני ') && timeStr.endsWith(' דקות')) {
    minutesAgo = parseInt(timeStr.replace('לפני ', '').replace(' דקות', ''), 10);
  } else if (timeStr === 'לפני שעה') {
    minutesAgo = 60;
  } else if (timeStr === 'לפני שעתיים') {
    minutesAgo = 120;
  } else if (timeStr.startsWith('לפני ') && timeStr.endsWith(' שעות')) {
    const hours = parseInt(timeStr.replace('לפני ', '').replace(' שעות', ''), 10);
    minutesAgo = hours * 60;
  } else if (/^\d{2}:\d{2}$/.test(timeStr)) {
    // format like "14:06"
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(refDate);
    // Assume time in Israel (GMT+3)
    d.setUTCHours(h - 3, m, 0, 0);
    return d.toISOString();
  } else {
    // fallback
    minutesAgo = 180;
  }
  const d = new Date(refDate.getTime() - minutesAgo * 60 * 1000);
  return d.toISOString();
}

const updatedContent = content.replace(/(time:\s*["']([^"']+)["'],)/g, (match, p1, p2) => {
  const dateStr = parseTimeToDate(p2);
  return `${p1}\n    datePublished: "${dateStr}",\n    dateModified: "${dateStr}",`;
});

fs.writeFileSync(filePath, updatedContent, 'utf-8');
console.log("Successfully updated articles.ts!");
