const db = require('../db');

/**
 * Get all expenses (with pagination)
 */
const getExpenses = async (req, res) => {
  const userId = req.user.id;

  // query params = string เสมอ
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;

  // กันค่าพัง
  if (limit < 1 || offset < 0) {
    return res.status(400).json({ message: 'Invalid pagination values' });
  }

  try {
    const result = await db.query(
      `SELECT e.*, c.name AS category_name
       FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = $1
       ORDER BY e.date DESC, e.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const expenses = result.rows.map(row => ({
      ...row,
      // กัน timezone issue
      date: row.date ? row.date.toISOString().slice(0, 10) : null
    }));

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Expense summary (total + by category)
 */
const getExpenseSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    // Total
    const totalResult = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = $1',
      [userId]
    );

    const total = parseFloat(totalResult.rows[0].total);

    // By category (LEFT JOIN กันข้อมูลหาย)
    const categoryResult = await db.query(
      `SELECT COALESCE(c.name, 'Uncategorized') AS name,
              SUM(e.amount) AS total
       FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = $1
       GROUP BY c.name
       ORDER BY total DESC`,
      [userId]
    );

    res.json({
      total_expense: total,
      by_category: categoryResult.rows.map(row => ({
        name: row.name,
        total: parseFloat(row.total)
      }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create expense
 */
const createExpense = async (req, res) => {
  const userId = req.user.id;
  const { category_id, amount, date, note } = req.body;

  // Validation ที่ถูกต้อง
  if (amount === undefined || amount === null || !date) {
    return res.status(400).json({ message: 'Amount and date are required' });
  }

  const amountNum = Number(amount);

  if (Number.isNaN(amountNum) || amountNum < 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    // เช็กว่า category เป็นของ user นี้จริง
    if (category_id) {
      const categoryCheck = await db.query(
        'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
        [category_id, userId]
      );

      if (categoryCheck.rows.length === 0) {
        return res.status(403).json({ message: 'Invalid category' });
      }
    }

    const result = await db.query(
      `INSERT INTO expenses (user_id, category_id, amount, date, note)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, category_id || null, amountNum, date, note || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getExpenses,
  getExpenseSummary,
  createExpense
};
