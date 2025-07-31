const pool = require('../config/db');

// Get categories for user
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM categories WHERE user_id = $1', [userId]);
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, icon, color } = req.body;
    const result = await pool.query(
      `INSERT INTO categories (user_id, name, type, icon, color) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, name, type, icon, color]
    );
    res.status(201).json({ category: result.rows[0] });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const { name, type, icon, color } = req.body;

    const updateQuery = `
      UPDATE categories 
      SET name=$1, type=$2, icon=$3, color=$4 
      WHERE id=$5 AND user_id=$6
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [name, type, icon, color, categoryId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found or unauthorized' });
    }

    res.json({ category: result.rows[0] });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;

    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
      [categoryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found or unauthorized' });
    }

    res.json({ message: 'Category deleted successfully', category: result.rows[0] });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
