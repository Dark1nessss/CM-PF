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
    const defaultBlock = new Block({
      type: "text",
      content: "",
      position: 0,
    });

    await defaultBlock.save();

    const otherPage = await OtherPage.create({
      title: title || "New Page",
      ownerId: req.user.id,
      pages: [defaultBlock._id],
    });

    await otherPage.populate("pages");

    res.status(201).json(otherPage);
  } catch (error) {
    res.status(500).json({ message: "Error creating OtherPage", error: error.message });
  }
};

// Move from Otherpages to Favorites
const moveToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const otherPage = await OtherPage.findOneAndDelete({ _id: id, ownerId: userId });

    if (!otherPage) {
      return res.status(404).json({ message: "Page not found in OtherPages" });
    }

    let pagesArray = otherPage.pages;
    if (pagesArray.length === 0) {
      const defaultBlock = new Block({
        type: "text",
        content: "",
        position: 0,
      });

      await defaultBlock.save();
      pagesArray.push(defaultBlock._id);
    }

    const favoritePage = new Favorite({
      _id: otherPage._id,
      title: otherPage.title,
      ownerId: otherPage.ownerId,
      pages: pagesArray,
    });

    await favoritePage.save();

    res.status(200).json({ message: "Page moved to favorites successfully", page: favoritePage });
  } catch (error) {
    console.error("Error moving page:", error.message);
    res.status(500).json({ message: "Error moving page to favorites", error: error.message });
  }
};

// Move from Otherpages to Favorites
const moveToPrivate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favoritePage = await Favorite.findOneAndDelete({ _id: id, ownerId: userId });

    if (!favoritePage) {
      return res.status(404).json({ message: "Page not found in Favorites" });
    }

    const otherPage = new OtherPage({
      _id: favoritePage._id,
      title: favoritePage.title,
      ownerId: favoritePage.ownerId,
      pages: favoritePage.pages,
    });

    await otherPage.save();

    res.status(200).json({ message: "Page moved to OtherPages successfully", page: otherPage });
  } catch (error) {
    console.error("Error moving page:", error.message);
    res.status(500).json({ message: "Error moving page to OtherPages", error: error.message });
  }
};

// Get Page ID
const getPageFromCollections = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Page ID is missing" });
    }

    let page = await OtherPage.findById(id).populate("pages");
    if (page) return res.status(200).json({ ...page._doc, source: "otherpages" });

    page = await Favorite.findById(id).populate("pages");
    if (page) return res.status(200).json({ ...page._doc, source: "favorites" });

    return res.status(404).json({ message: "Page not found in any collection" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching page", error: error.message });
  }
};

// Update a page (including title and content)
const updatePage = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    let page = await OtherPage.findById(id).populate("pages");
    if (!page) page = await Favorite.findById(id).populate("pages"); // Check Favorites

    if (!page) return res.status(404).json({ message: "Page not found" });

    if (title) page.title = title;

    if (content) {
      if (page.pages.length > 0) {
        const blockId = page.pages[0]._id;
        await Block.findByIdAndUpdate(blockId, { content });
      }
    }

    page.updatedAt = Date.now();
    await page.save();

    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "Error updating page", error: error.message });
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
    const block = await Block.findByIdAndUpdate(id, { content }, { new: true });
    
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }
    
    res.status(200).json(block);
  } catch (error) {
    res.status(500).json({ message: 'Error updating block', error: error.message });
  }
};

module.exports = { getFavorites, getOtherPages, createPage,  moveToFavorites, moveToPrivate, getPageFromCollections, updatePage, createBlock, updateBlock };