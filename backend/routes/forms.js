const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/auth")
const { body, validationResult } = require('express-validator');
const FeedbackForm = require('../models/feedbackForm');
const Feedback = require('../models/feedback');

// Validation middleware
const validateForm = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('questions')
        .isArray({ min: 1 })
        .withMessage('At least one question is required'),
    body('questions.*.text')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Question text must be between 1 and 500 characters'),
    body('questions.*.type')
        .isIn(['rating', 'text'])
        .withMessage('Question type must be either "rating" or "text"'),
];

// GET /api/forms - Get all forms
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 10, active } = req.query;
        const query = {};

        if (active !== undefined) {
            query.isActive = active === 'true';
        }

        const forms = await FeedbackForm.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('title questions createdAt updatedAt isActive');

        const total = await FeedbackForm.countDocuments(query);

        res.json({
            success: true,
            data: forms,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete form',
            error: error.message
        });
    }
});

// GET /api/forms/:id/stats - Get form statistics
router.get('/:id/stats', protect, async (req, res) => {
    try {
        const form = await FeedbackForm.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        // Get feedback count and statistics
        const feedbackCount = await Feedback.countDocuments({ formId: req.params.id });
        const feedbacks = await Feedback.find({ formId: req.params.id });

        // Calculate rating statistics
        const ratingStats = {};
        const textResponses = [];

        form.questions.forEach(question => {
            if (question.type === 'rating') {
                const ratings = feedbacks.map(feedback => {
                    const response = feedback.responses.find(r => r.questionId === question.questionId);
                    return response ? response.response : 0;
                }).filter(rating => rating > 0);

                if (ratings.length > 0) {
                    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                    ratingStats[question.questionId] = {
                        question: question.text,
                        average: Math.round(average * 100) / 100,
                        total: ratings.length,
                        distribution: {
                            1: ratings.filter(r => r === 1).length,
                            2: ratings.filter(r => r === 2).length,
                            3: ratings.filter(r => r === 3).length,
                            4: ratings.filter(r => r === 4).length,
                            5: ratings.filter(r => r === 5).length,
                        }
                    };
                }
            } else {
                const responses = feedbacks.map(feedback => {
                    const response = feedback.responses.find(r => r.questionId === question.questionId);
                    return response ? response.response : '';
                }).filter(response => response.trim() !== '');

                textResponses.push({
                    questionId: question.questionId,
                    question: question.text,
                    responses: responses
                });
            }
        });

        res.json({
            success: true,
            data: {
                formId: req.params.id,
                title: form.title,
                totalResponses: feedbackCount,
                ratingStats,
                textResponses,
                createdAt: form.createdAt
            }
        });
    } catch (error) {
        console.error('Error fetching form stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch form statistics',
            error: error.message
        });
    }
});

module.exports = router;

// GET /api/forms/:id - Get a specific form
router.get('/:id', protect, async (req, res) => {
    try {
        const form = await FeedbackForm.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        res.json({
            success: true,
            data: form
        });
    } catch (error) {
        console.error('Error fetching form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch form',
            error: error.message
        });
    }
});

// POST /api/forms - Create a new form
router.post('/', protect, validateForm, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, questions } = req.body;

        // Add unique IDs to questions
        const questionsWithIds = questions.map((q, index) => ({
            questionId: `q_${Date.now()}_${index}`,
            text: q.text,
            type: q.type
        }));

        const form = new FeedbackForm({
            title,
            questions: questionsWithIds
        });

        const savedForm = await form.save();

        res.status(201).json({
            success: true,
            message: 'Form created successfully',
            data: savedForm
        });
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create form',
            error: error.message
        });
    }
});

// PUT /api/forms/:id - Update a form
router.put('/:id', protect, validateForm, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, questions, isActive } = req.body;

        const form = await FeedbackForm.findById(req.params.id);
        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        // Update form fields
        form.title = title;
        form.questions = questions.map((q, index) => ({
            questionId: q.questionId || `q_${Date.now()}_${index}`,
            text: q.text,
            type: q.type
        }));

        if (isActive !== undefined) {
            form.isActive = isActive;
        }

        const updatedForm = await form.save();

        res.json({
            success: true,
            message: 'Form updated successfully',
            data: updatedForm
        });
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update form',
            error: error.message
        });
    }
});

// DELETE /api/forms/:id - Delete a form (soft delete by setting isActive to false)
router.delete('/:id', protect, async (req, res) => {
    try {
        const form = await FeedbackForm.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        // Soft delete
        form.isActive = false;
        await form.save();

        res.json({
            success: true,
            message: 'Form deactivated successfully'
        });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch forms',
            error: error.message
        });
    }
});