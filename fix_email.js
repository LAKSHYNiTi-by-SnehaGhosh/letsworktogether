const fs = require('fs');
const files = [
  'src/app/api/mentors/action/route.ts',
  'src/app/api/mentors/apply/route.ts',
  'src/app/api/mentors/request/route.ts',
  'src/app/api/subscriptions/upgrade/route.ts',
  'src/app/dashboard/billing/page.tsx',
  'src/app/dashboard/calendar/page.tsx',
  'src/app/dashboard/companies/page.tsx',
  'src/app/dashboard/mentor-dashboard/page.tsx',
  'src/app/dashboard/mentors/page.tsx',
  'src/app/dashboard/mentors/request/[mentorId]/page.tsx',
  'src/app/dashboard/portfolio/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/where:\s*\{\s*email:\s*clerkUser\.emailAddresses\[0\](?:\?)?\.emailAddress\s*\}/g, 'where: { id: clerkUser.id }');
  content = content.replace(/where:\s*\{\s*email:\s*user\.emailAddresses\[0\](?:\?)?\.emailAddress\s*\}/g, 'where: { id: user.id }');
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
