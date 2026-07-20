sed -i 's/const clerkUser = await currentUser();/const clerkUser = { id: "test", emailAddresses: [{ emailAddress: "test@test.com" }] };/' src/app/dashboard/billing/page.tsx
npm run dev > dev.log 2>&1 &
PID=$!
sleep 10
curl -s http://localhost:3000/dashboard/billing > /dev/null
sleep 2
kill $PID
cat dev.log | grep -i "error" -A 15 -B 5
git checkout src/app/dashboard/billing/page.tsx
