const pool = require('../config/db');

exports.getTransactions = async (req, res) => {// get transactions for the authenticated user with optional filters
  try {
    const userId = req.user.id;
    const {
      startDate,
      endDate,
      category,    // category_id
      type,        // 'expense' or 'income'
      limit = 20,
      offset = 0,
    } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (startDate) {
      query += ` AND date >= $${paramIndex++}`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND date <= $${paramIndex++}`;
      params.push(endDate);
    }
    if (category) {
      query += ` AND category_id = $${paramIndex++}`;
      params.push(category);
    }
    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    query += ` ORDER BY date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(Number(limit), Number(offset));

    const transactionsResult = await pool.query(query, params);

    // Optional: total count (for frontend pagination)
    const countQuery = 'SELECT COUNT(*) FROM transactions WHERE user_id = $1';
    const countParams = [userId];
    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    res.json({
      transactions: transactionsResult.rows,
      totalCount,
    });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};


exports.createTransaction = async (req, res) => {// create a new transaction, optionally with a receipt upload
  try {
    const userId = req.user.id;
    const { category_id, amount, type, description, date } = req.body;

    let receipt_url = null;
    if (req.file) {
      receipt_url = `/uploads/receipts/${userId}/${req.file.filename}`;
    }

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


exports.updateTransaction = async (req, res) => {// update transaction by ID, optionally with a new receipt upload
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    const { category_id, amount, type, description, date } = req.body;

    let receipt_url = null;
    if (req.file) {
      // New file uploaded — update the receipt_url path
      receipt_url = `/uploads/receipts/${userId}/${req.file.filename}`;
    } else if (req.body.receipt_url) {
      // Keep existing receipt_url if provided in body
      receipt_url = req.body.receipt_url;
    }

    const query = `
      UPDATE transactions
      SET category_id=$1, amount=$2, type=$3, description=$4, date=$5, receipt_url=$6, updated_at=NOW()
      WHERE id=$7 AND user_id=$8
      RETURNING *
    `;

    const params = [
      category_id,
      amount,
      type,
      description,
      date,
      receipt_url,
      transactionId,
      userId,
    ];

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

exports.deleteTransaction = async (req, res) => {// delete transaction by ID
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const result = await pool.query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *`,
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    res.json({ message: 'Transaction deleted successfully', transaction: result.rows[0] });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
