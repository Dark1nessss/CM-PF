const Favorite = require('../models/Favorite');
const OtherPage = require('../models/OtherPage');
const { Page, Block } = require('../models/Page');

// Fetch Favorites
const getFavorites = async (req, res) => {
  try {
      const favorites = await Favorite.find({ ownerId: req.user.id }).populate('pages');
      res.status(200).json(favorites);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};

// Fetch Other Pages
const getOtherPages = async (req, res) => {
  try {
      const otherPages = await OtherPage.find({ ownerId: req.user.id }).populate('pages');
      res.status(200).json(otherPages);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching other pages', error: error.message });
  }
};

// Create a new page
const createPage = async (req, res) => {
  const { title } = req.body;

  try {
    const otherPage = await OtherPage.create({
      title,
      ownerId: req.user.id,
      pages: [],
    });

    res.status(201).json(otherPage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating OtherPage', error: error.message });
  }
};

// Get all pages for the logged-in user
const getPages = async (req, res) => {
  const { layerId, layerType } = req.params;

  try {
      const pages = await Page.find({ parentLayer: layerId, layerType }).populate('blocks');
      res.status(200).json(pages);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching pages', error: error.message });
  }
};

// Update a page title
const updatePage = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const page = await Page.findByIdAndUpdate(id, { title }, { new: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error updating page', error: error.message });
  }
};

// Delete a page
const deletePage = async (req, res) => {
  const { id } = req.params;

  try {
    const page = await Page.findByIdAndDelete(id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    await Block.deleteMany({ pageId: id });
    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page', error: error.message });
  }
};

// Create a block
const createBlock = async (req, res) => {
  const { pageId, type, content, position } = req.body;

  try {
    const block = await Block.create({ pageId, type, content, position });
    await Page.findByIdAndUpdate(pageId, { $push: { blocks: block._id } });
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ message: 'Error creating block', error: error.message });
  }
};

// Update a block
const updateBlock = async (req, res) => {
  const { id } = req.params;
  const { content, position } = req.body;

  try {
    const block = await Block.findByIdAndUpdate(id, { content, position }, { new: true });
    if (!block) return res.status(404).json({ message: 'Block not found' });

    res.status(200).json(block);
  } catch (error) {
    res.status(500).json({ message: 'Error updating block', error: error.message });
  }
};

// Delete a block
const deleteBlock = async (req, res) => {
  const { id } = req.params;

  try {
    const block = await Block.findByIdAndDelete(id);
    if (!block) return res.status(404).json({ message: 'Block not found' });

    await Page.updateMany({ blocks: id }, { $pull: { blocks: id } });
    res.status(200).json({ message: 'Block deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting block', error: error.message });
  }
};

// Move from Otherpages to Favorites
const moveToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const otherPage = await OtherPage.findOneAndDelete({ _id: id, ownerId: userId });

    if (!otherPage) {
      return res.status(404).json({ message: 'Page not found in OtherPages' });
    }

    const favoritePage = new Favorite({
      _id: otherPage._id,
      title: otherPage.title,
      ownerId: otherPage.ownerId,
      pages: otherPage.pages,
      subPages: otherPage.subPages,
      __v: otherPage.__v,
    });

    await favoritePage.save();

    res.status(200).json({ message: 'Page moved to favorites successfully', page: favoritePage });
  } catch (error) {
    console.error('Error moving page:', error.message);
    res.status(500).json({ message: 'Error moving page to favorites', error: error.message });
  }
};

module.exports = { getFavorites, getOtherPages, createPage, getPages, updatePage, deletePage, createBlock, updateBlock, deleteBlock, moveToFavorites };