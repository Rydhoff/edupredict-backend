import Concept from "../models/concept.model.js";

export const createConcept = async (req, res) => {
  try {
    const { slug, name, description } = req.body;

    if (!slug || !name) {
      return res.status(400).json({
        message: "Slug and name are required",
      });
    }

    const existingConcept = await Concept.findOne({ slug });

    if (existingConcept) {
      return res.status(409).json({
        message: "Concept slug already exists",
      });
    }

    const concept = await Concept.create({
      slug,
      name,
      description,
    });

    res.status(201).json({
      message: "Concept created successfully",
      concept,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create concept",
      error: error.message,
    });
  }
};

export const getConcepts = async (req, res) => {
  try {
    const concepts = await Concept.find().sort({ createdAt: -1 });

    res.json({
      concepts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get concepts",
      error: error.message,
    });
  }
};

export const getConceptById = async (req, res) => {
  try {
    const concept = await Concept.findById(req.params.id);

    if (!concept) {
      return res.status(404).json({
        message: "Concept not found",
      });
    }

    res.json({
      concept,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get concept",
      error: error.message,
    });
  }
};