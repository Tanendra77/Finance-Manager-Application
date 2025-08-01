const cron = require('node-cron');
const pool = require('../config/db');

/**
 * Helper: Add interval to a date based on interval string.
 * Extend this function to support more intervals as needed.
 */
function addInterval(date, interval) {
  const nextDate = new Date(date);

  switch ((interval || '').toLowerCase()) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
    case 'annually':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unsupported interval: ${interval}`);
  }

  return nextDate;
}

/**
 * Scheduled job to process due recurring transactions.
 */
async function processRecurringTransactions() {
  console.log('Running recurring transactions job...');

  try {
    const today = new Date();
    // We will consider all recurring transactions with next_run_date <= today and active = true
    const query = `
      SELECT * FROM recurring_transactions 
      WHERE active = TRUE
      AND next_run_date <= $1;
    `;

    const { rows: dueTransactions } = await pool.query(query, [today]);

    if (dueTransactions.length === 0) {
      console.log('No recurring transactions to process today.');
      return;
    }

    console.log(`Found ${dueTransactions.length} recurring transactions to process.`);

    for (const rt of dueTransactions) {
      // Insert a transaction for each recurring transaction
      const insertTransactionQuery = `
        INSERT INTO transactions
        (user_id, category_id, amount, type, description, date)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `;

      // For transaction date, use the next_run_date of recurring transaction
      const transactionDate = rt.next_run_date;

      await pool.query(insertTransactionQuery, [
        rt.user_id,
        rt.category_id,
        rt.amount,
        rt.type,
        rt.description,
        transactionDate
      ]);

      // Calculate and update the next_run_date on recurring_transactions
      let newNextRunDate = null;
      try {
        newNextRunDate = addInterval(transactionDate, rt.interval);
      } catch (err) {
        console.error(`Failed to update interval for recurring transaction ${rt.id}:`, err.message);
        // Choose whether to deactivate or leave as is; here, leave as is.
        continue;
      }

      await pool.query(
        `UPDATE recurring_transactions SET next_run_date = $1 WHERE id = $2`,
        [newNextRunDate, rt.id]
      );

      console.log(`Processed recurring transaction ${rt.id}, next run date updated to ${newNextRunDate.toISOString().slice(0,10)}`);
    }
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
  }
}

module.exports = {
  processRecurringTransactions,
  addInterval,
};
