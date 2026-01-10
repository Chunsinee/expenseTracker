const db = require('../db');

// Get all categories for the logged-in user
const getCategories = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY id ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new category
const addCategory = async (req, res) => {
  const { name } = req.body;
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return res.status(400).json({ message: 'Please provide a category name' });
  }

  try {
    const exists = await db.query(
      'SELECT 1 FROM categories WHERE name = $1 AND user_id = $2',
      [normalizedName, req.user.id]
    );

    if (exists.rowCount > 0) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const result = await db.query(
      'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *',
      [normalizedName, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  addCategory,
};
