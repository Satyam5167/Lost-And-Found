// server/controllers/userController.js
import * as userQueries from "../queries/userQueries.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userQueries.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ error: "Failed to retrieve user data" });
  }
};
