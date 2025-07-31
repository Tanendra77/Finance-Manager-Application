const pool = require('../config/db');

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, category, type } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];
    let idx = 2;

    if (startDate) {
      query += ` AND date >= $${idx++}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND date <= $${idx++}`;
      params.push(endDate);
    }

    if (category) {
      query += ` AND category_id = $${idx++}`;
      params.push(category);
    }

    if (type) {
      query += ` AND type = $${idx++}`;
      params.push(type);
    }

    query += ' ORDER BY date DESC';

    const result = await pool.query(query, params);
    res.json({ transactions: result.rows });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, amount, type, description, date, receipt_url } = req.body;
    const result = await pool.query(
      `INSERT INTO transactions
      (user_id, category_id, amount, type, description, date, receipt_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [userId, category_id, amount, type, description, date, receipt_url]
    );
    res.status(201).json({ transaction: result.rows[0] });
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    const { category_id, amount, type, description, date, receipt_url } = req.body;

    const query = `
      UPDATE transactions SET category_id=$1, amount=$2, type=$3,
      description=$4, date=$5, receipt_url=$6
      WHERE id=$7 AND user_id=$8 RETURNING *
    `;

    const params = [category_id, amount, type, description, date, receipt_url, transactionId, userId];
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }
    res.json({ transaction: result.rows[0] });
  } catch (err) {
    console.error('Update transaction error:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    res.json({ message: 'Transaction deleted', transaction: result.rows[0] });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
