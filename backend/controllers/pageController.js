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

// Move from Otherpages to Favorites
const moveToPrivate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({ _id: id, ownerId: userId });

    if (!favorite) {
      return res.status(404).json({ message: 'Page not found in OtherPages' });
    }

    const otherPage = new OtherPage({
      _id: favorite._id,
      title: favorite.title,
      ownerId: favorite.ownerId,
      pages: favorite.pages,
      subPages: favorite.subPages,
      __v: favorite.__v,
    });

    await otherPage.save();

    res.status(200).json({ message: 'Page moved to OtherPages successfully', page: otherPage });
  } catch (error) {
    console.error('Error moving page:', error.message);
    res.status(500).json({ message: 'Error moving page to OtherPages', error: error.message });
  }
};

// Get Page ID
const getPageFromCollections = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Page ID is missing' });
    }

    const pageFromOtherPages = await OtherPage.findById(id);
    if (pageFromOtherPages) {
      return res.status(200).json({ ...pageFromOtherPages._doc, source: 'otherpages' });
    }

    const pageFromFavorites = await Favorite.findById(id);
    if (pageFromFavorites) {
      return res.status(200).json({ ...pageFromFavorites._doc, source: 'favorites' });
    }

    console.log('Page not found in any collection');
    return res.status(404).json({ message: 'Page not found in any collection' });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ message: 'Error fetching page details', error: error.message });
  }
};

// Update a page (including title and content)
const updatePage = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const page = await Page.findByIdAndUpdate(id, { 
      title, 
      content, 
      updatedAt: Date.now()
    }, { new: true });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error updating page', error: error.message });
  }
};

// Create a new block (e.g., for text, image, etc.)
const createBlock = async (req, res) => {
  const { type, content, position } = req.body;
  
  try {
    const block = new Block({ type, content, position });
    await block.save();
    
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ message: 'Error creating block', error: error.message });
  }
};

// Update a block (e.g., change the content or position)
const updateBlock = async (req, res) => {
  const { id } = req.params;
  const { content, position } = req.body;
  
  try {
    const block = await Block.findByIdAndUpdate(id, { content, position }, { new: true });
    
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }
    
    res.status(200).json(block);
  } catch (error) {
    res.status(500).json({ message: 'Error updating block', error: error.message });
  }
};

module.exports = { getFavorites, getOtherPages, createPage,  moveToFavorites, moveToPrivate, getPageFromCollections, updatePage, createBlock, updateBlock };