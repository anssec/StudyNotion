const Tag = require("../models/Tags");

//create tag
exports.Tag = async (req, res) => {
  try {
    //get data from req body
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      res.status(401).json({
        success: false,
        message: "All field are required",
      });
    }

    //create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    //res return
    res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all Tag
exports.showAllTag = async (req, res) => {
    try {
        const allTags=await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success: true,
            message: 'All tags return successfully',
          });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
};
