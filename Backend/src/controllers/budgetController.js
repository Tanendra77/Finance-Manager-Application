const pool = require('../config/db');

// Get all budgets for the authenticated user
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM budgets WHERE user_id = $1 ORDER BY start_date DESC',
      [userId]
    );
    res.json({ budgets: result.rows });
  } catch (err) {
    console.error('Get budgets error:', err);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

// Create a budget
exports.createBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, amount, period, start_date, end_date } = req.body;

    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, category_id, amount, period, start_date, end_date]
    );

    res.status(201).json({ budget: result.rows[0] });
  } catch (err) {
    console.error('Create budget error:', err);
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

// Update budget by ID
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;
    const { category_id, amount, period, start_date, end_date } = req.body;

    const query = `
      UPDATE budgets 
      SET category_id=$1, amount=$2, period=$3, start_date=$4, end_date=$5 
      WHERE id=$6 AND user_id=$7 
      RETURNING *
    `;

    const result = await pool.query(query, [
      category_id,
      amount,
      period,
      start_date,
      end_date,
      budgetId,
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found or unauthorized' });
    }

    res.json({ budget: result.rows[0] });
  } catch (err) {
    console.error('Update budget error:', err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

// Delete budget by ID
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    const result = await pool.query(
      'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *',
      [budgetId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found or unauthorized' });
    }

    res.json({ message: 'Budget deleted successfully', budget: result.rows[0] });
  } catch (err) {
    console.error('Delete budget error:', err);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
