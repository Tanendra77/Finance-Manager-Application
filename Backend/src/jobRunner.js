const cron = require('node-cron');
const { processRecurringTransactions } = require('./jobs/recurringJob');

// Run job every day at 00:05 AM server time
cron.schedule('5 0 * * *', async () => {
  console.log('Starting scheduled recurring transactions job...');
  await processRecurringTransactions();
  console.log('Recurring transactions job completed.');
});
