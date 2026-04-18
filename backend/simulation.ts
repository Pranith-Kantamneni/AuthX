import crypto from 'crypto';

async function runSimulation() {
  console.log("Starting load simulation...");
  const users = Array.from({ length: 100 }).map((_, i) => ({
    username: `user_${i}_${crypto.randomBytes(4).toString('hex')}`,
    password: crypto.randomBytes(8).toString('hex')
  }));

  let successCount = 0;
  for (const user of users) {
    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) successCount++;
    } catch (e) {
      console.error(e);
    }
  }

  console.log(`Successfully registered ${successCount} synthetic users.`);
}

runSimulation();
