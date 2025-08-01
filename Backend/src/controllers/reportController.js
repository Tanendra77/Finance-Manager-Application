const pool = require('../config/db');

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate query params are required' });
    }

    const query = `
      SELECT type, COALESCE(SUM(amount), 0) AS total_amount
      FROM transactions
      WHERE user_id = $1
        AND date BETWEEN $2 AND $3
      GROUP BY type;
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);

    // Transform result to ensure both income and expense keys present
    const summary = { income: 0, expense: 0 };
    result.rows.forEach(row => {
      if (row.type === 'income' || row.type === 'expense') {
        summary[row.type] = Number(row.total_amount);
      }
    });

    res.json({ summary });
  } catch (err) {
    console.error('Get summary report error:', err);
    res.status(500).json({ error: 'Failed to get summary report' });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, type } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate query params are required' });
    }

    let baseQuery = `
      SELECT c.name AS category_name, c.type, COALESCE(SUM(t.amount),0) AS total_amount
      FROM categories c
      LEFT JOIN transactions t ON t.category_id = c.id
        AND t.user_id = $1
        AND t.date BETWEEN $2 AND $3
    `;

    const params = [userId, startDate, endDate];
    if (type && (type === 'income' || type === 'expense')) {
      baseQuery += ` WHERE c.type = $4`;
      params.push(type);
    }

    baseQuery += ` GROUP BY c.name, c.type ORDER BY total_amount DESC;`;

    const result = await pool.query(baseQuery, params);

    res.json({ breakdown: result.rows });
  } catch (err) {
    console.error('Get category breakdown error:', err);
    res.status(500).json({ error: 'Failed to get category breakdown' });
  }
};

exports.getBudgetVsSpending = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate query params are required' });
    }

    const query = `
      SELECT
        b.category_id,
        c.name AS category_name,
        b.amount AS budget_amount,
        COALESCE(SUM(t.amount), 0) AS spending_amount
      FROM budgets b
      LEFT JOIN transactions t ON t.category_id = b.category_id
        AND t.user_id = b.user_id
        AND t.date BETWEEN b.start_date AND b.end_date
      JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = $1
        AND b.start_date <= $3 AND b.end_date >= $2
      GROUP BY b.category_id, c.name, b.amount
      ORDER BY c.name;
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);

    res.json({ budgets: result.rows });
  } catch (err) {
    console.error('Get budget vs spending error:', err);
    res.status(500).json({ error: 'Failed to get budget vs spending report' });
  }
};
