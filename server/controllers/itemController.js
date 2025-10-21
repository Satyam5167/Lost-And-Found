// server/controllers/itemController.js
import * as itemQueries from '../queries/itemQueries.js';

// Fetch all items
export const getAllItems = async (req, res) => {
  try {
    const items = await itemQueries.queryAllItems();
    res.json(items);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Can't fetch items" });
  }
};

// Get a single item
export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await itemQueries.queryItemById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add an item
export const addItem = async (req, res) => {
  try {
    const { title, description, location, status, date_reported } = req.body;
    const imageUrl = req.file.path; // Cloudinary URL
    const userId = req.userId; // From authMiddleware

    const newItem = await itemQueries.insertItem({
      title,
      description,
      location,
      status,
      date_reported,
      imageUrl,
      userId,
    });

    res.json(newItem);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

// Update an item
export const updateItem = async (req, res) => {
  const { id } = req.params; // The item ID to update
  const { title, description, location, status, date_reported } = req.body;
  
  //Get the logged-in user's ID
  const userId = req.userId; // From authMiddleware

  try {
    const itemData = { title, description, location, status, date_reported };
    
    const result = await itemQueries.updateItemById(id, itemData, userId);

    //Check if any row was actually updated
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found or you are not authorized' });
    }
    
    res.json({ message: 'Item updated successfully' });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Can't update item" });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await itemQueries.deleteItemById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'item deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Can't delete item" });
  }
};

// Get items uploaded by a particular user
export const getUserItems = async (req, res) => {
  const userId = req.userId; // From authMiddleware
  try {
    const items = await itemQueries.queryUserItems(userId);
    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Can't fetch user's items" });
  }
};

// Delete an item owned by a particular user
export const deleteUserItem = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.userId; // From authMiddleware

  try {
    const result = await itemQueries.deleteUserItemById(itemId, userId);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'Item not found or not owned by user' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Can't delete item" });
  }
};