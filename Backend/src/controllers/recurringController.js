const pool = require('../config/db');

// Get all recurring transactions for authenticated user
exports.getRecurringTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM recurring_transactions WHERE user_id = $1 ORDER BY next_run_date ASC',
      [userId]
    );
    res.json({ recurring_transactions: result.rows });
  } catch (err) {
    console.error('Get recurring transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch recurring transactions' });
  }
};

// Create a new recurring transaction
exports.createRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, amount, type, description, interval, next_run_date, active } = req.body;

    const result = await pool.query(
      `INSERT INTO recurring_transactions 
        (user_id, category_id, amount, type, description, interval, next_run_date, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, true))
        RETURNING *`,
      [userId, category_id, amount, type, description, interval, next_run_date, active]
    );

    res.status(201).json({ recurring_transaction: result.rows[0] });
  } catch (err) {
    console.error('Create recurring transaction error:', err);
    res.status(500).json({ error: 'Failed to create recurring transaction' });
  }
};

// Update an existing recurring transaction by ID
exports.updateRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { category_id, amount, type, description, interval, next_run_date, active } = req.body;

    const query = `
      UPDATE recurring_transactions 
      SET category_id=$1,
          amount=$2, 
          type=$3, 
          description=$4, 
          interval=$5, 
          next_run_date=$6, 
          active=$7
      WHERE id=$8 AND user_id=$9
      RETURNING *
    `;

    const result = await pool.query(query, [
      category_id,
      amount,
      type,
      description,
      interval,
      next_run_date,
      active,
      id,
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recurring transaction not found or unauthorized' });
    }

    res.json({ recurring_transaction: result.rows[0] });
  } catch (err) {
    console.error('Update recurring transaction error:', err);
    res.status(500).json({ error: 'Failed to update recurring transaction' });
  }
};

// Delete a recurring transaction by ID
exports.deleteRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const result = await pool.query(
      'DELETE FROM recurring_transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recurring transaction not found or unauthorized' });
    }

    res.json({ message: 'Recurring transaction deleted successfully', recurring_transaction: result.rows[0] });
  } catch (err) {
    console.error('Delete recurring transaction error:', err);
    res.status(500).json({ error: 'Failed to delete recurring transaction' });
  }
};
