import { Router } from 'express';
import { getBeginSteps, getPlanSteps, determineRecommendedPlan, generatePlan } from '../controllers/planController';
import { verifyToken } from '../utils/token';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     BeginStep:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         title:
 *           type: string
 *           example: "Personal Information"
 *         fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "select"
 *               label:
 *                 type: string
 *                 example: "Age Range"
 *               key:
 *                 type: string
 *                 example: "ageRange"
 *               required:
 *                 type: boolean
 *                 example: true
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       example: "18-25"
 *                     label:
 *                       type: string
 *                       example: "18-25 years"
 *     PlanStep:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         title:
 *           type: string
 *           example: "Basic Bagpack Information"
 *         fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "input"
 *               label:
 *                 type: string
 *                 example: "Number of People"
 *               key:
 *                 type: string
 *                 example: "peopleCount"
 *               required:
 *                 type: boolean
 *                 example: true
 *               inputType:
 *                 type: string
 *                 example: "number"
 *               min:
 *                 type: number
 *                 example: 1
 *               max:
 *                 type: number
 *                 example: 10
 *     PlanRecommendation:
 *       type: object
 *       properties:
 *         primaryRecommendation:
 *           type: string
 *           example: "emergency-bagpack"
 *         secondaryRecommendation:
 *           type: string
 *           example: "storage"
 *         reasoning:
 *           type: string
 *           example: "Based on your urban location, apartment living situation, and concern for natural disasters"
 *     PlanGenerationRequest:
 *       type: object
 *       properties:
 *         location:
 *           type: string
 *           example: "urban"
 *         familySize:
 *           type: number
 *           example: 4
 *         specificNeeds:
 *           type: string
 *           example: "elderly care, pet care"
 *     PlanGenerationResponse:
 *       type: object
 *       properties:
 *         steps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlanStep'
 *         estimatedTime:
 *           type: string
 *           example: "2 weeks"
 *         priority:
 *           type: string
 *           example: "high"
 */

/**
 * @swagger
 * /api/plans/begin:
 *   get:
 *     summary: Get initial assessment steps
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Initial assessment steps retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BeginStep'
 *             example:
 *               - id: 1
 *                 title: "Personal Information"
 *                 fields:
 *                   - type: "select"
 *                     label: "Age Range"
 *                     key: "ageRange"
 *                     required: true
 *                     options:
 *                       - value: "18-25"
 *                         label: "18-25 years"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/begin', verifyToken, getBeginSteps);

/**
 * @swagger
 * /api/plans/{planType}/steps:
 *   get:
 *     summary: Get steps for a specific plan type
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [emergency-bagpack, storage, emergency-fund]
 *         example: emergency-bagpack
 *     responses:
 *       200:
 *         description: Plan steps retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlanStep'
 *             example:
 *               - id: 1
 *                 title: "Basic Bagpack Information"
 *                 fields:
 *                   - type: "input"
 *                     label: "Number of People"
 *                     key: "peopleCount"
 *                     required: true
 *                     inputType: "number"
 *                     min: 1
 *                     max: 10
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Plan type not found
 *       500:
 *         description: Server error
 */
router.get('/:planType/steps', verifyToken, getPlanSteps);

/**
 * @swagger
 * /api/plans/recommend:
 *   post:
 *     summary: Get plan recommendations based on form data
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanGenerationRequest'
 *           example:
 *             location: "urban"
 *             familySize: 4
 *             specificNeeds: "elderly care, pet care"
 *     responses:
 *       200:
 *         description: Plan recommendations generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanRecommendation'
 *             example:
 *               primaryRecommendation: "emergency-bagpack"
 *               secondaryRecommendation: "storage"
 *               reasoning: "Based on your urban location, apartment living situation, and concern for natural disasters"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/recommend', verifyToken, determineRecommendedPlan);

/**
 * @swagger
 * /api/plans/generate:
 *   post:
 *     summary: Generate a customized plan using AI
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/PlanGenerationRequest'
 *               - type: object
 *                 properties:
 *                   planType:
 *                     type: string
 *                     enum: [emergency-bagpack, storage, emergency-fund]
 *                     example: emergency-bagpack
 *                   details:
 *                     type: object
 *                     properties:
 *                       peopleCount:
 *                         type: number
 *                         example: 4
 *                       duration:
 *                         type: string
 *                         example: "72h"
 *           example:
 *             planType: "emergency-bagpack"
 *             details:
 *               peopleCount: 4
 *               mobilityNeeds: "medium"
 *               duration: "72h"
 *     responses:
 *       200:
 *         description: AI-generated plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanGenerationResponse'
 *             example:
 *               message: "Emergency plan generated successfully"
 *               plan: "Prepare a 72-hour emergency bagpack for 4 people with medium mobility needs"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/generate', verifyToken, generatePlan);

export default router; 