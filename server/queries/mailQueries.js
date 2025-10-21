    // server/queries/mailQueries.js
import pool from "../db.js";

export const getClaimDetails = async (claimerId, itemId) => {
  const result = await pool.query(
    `
      SELECT 
        items.title,
        owner.email AS owner_email,
        claimer.email AS claimer_email,
        claimer.phone AS claimer_phone,
        claimer.name AS claimer_name
      FROM items
      JOIN users AS owner ON items.user_id = owner.id
      JOIN users AS claimer ON claimer.id = $1
      WHERE items.id = $2
    `,
    [claimerId, itemId]
  );
  return result.rows[0];
};
