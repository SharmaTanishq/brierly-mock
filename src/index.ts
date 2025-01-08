import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        isError: false,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString()
        },
        developerMessage: '',
        userMessage: 'Service is healthy',
        moreInfo: null,
        responseCode: 10000,
        httpStatusCode: 200,
        errors: null,
        requestId: uuidv4()
    });
});


// Auth token endpoint
app.post('/auth/token', (req: any, res: any) => {
    const { clientSecret, clientId } = req.body;

    // In a real application, you would validate the clientSecret and clientId here
    if (!clientSecret || !clientId) {
        return res.status(400).json({
            isError: true,
            data: null,
            developerMessage: "Missing clientSecret or clientId",
            userMessage: "Invalid credentials provided.",
            moreInfo: null,
            responseCode: 11004,
            httpStatusCode: 400,
            errors: ["Missing required credentials"],
            requestId: uuidv4()
        });
    }

    // Mock successful response
    res.status(200).json({
        isError: false,
        data: {
            tokenType: "bearer",
            accessToken: "lgFr6nesGmBoRQrtD2xg1m0ToUcNYwDl",
            expiresIn: 86400
        },
        developerMessage: null,
        userMessage: "You have been successfully authorized.",
        moreInfo: null,
        responseCode: 11003,
        httpStatusCode: 200,
        errors: null,
        requestId: uuidv4()
    });
});

//Create Loyalty Members endpoint
//@ts-ignore
app.post('/loyalty/members', (req: Request, res: Response) => {
    const { email, firstName, attributeSets } = req.body;

    // Validate required fields
    if (!email || !firstName || !attributeSets) {
        return res.status(400).json({
            isError: true,
            data: null,
            developerMessage: "Missing required fields",
            userMessage: "Missing required information",
            moreInfo: null,
            responseCode: 12002,
            httpStatusCode: 400,
            errors: ["email, firstName and attributeSets are required"],
            requestId: uuidv4()
        });
    }

    // Import response data


    const response = require('./sampleResponse/customerCreatedResponse.json');
    res.status(201).json(response);
});

// Get Member Rewards endpoint
app.get('/api/v1/loyalty/memberRewards', (req: any, res: any) => {
    const { 'member.email': memberEmail } = req.query;

    // Check if required email parameter is present
    if (!memberEmail) {
        return res.status(400).json({
            isError: true,
            data: null,
            developerMessage: "Missing required query parameter",
            userMessage: "Missing required parameter",
            moreInfo: null,
            responseCode: 10001,
            httpStatusCode: 400,
            errors: ["member.email is a required parameter"],
            requestId: uuidv4()
        });
    }

    // Import response data
    const memberRewardsResponse = require('./sampleResponse/retreiveMemberCoupons.json');

    res.status(200).json(memberRewardsResponse);
});


// Get Customer Details endpoint
app.get('/api/v1/loyalty/members', (req: any, res: any) => {
    const { include, 'member.email': memberEmail } = req.query;

    // Check if required query parameters are present
    if (!include || !memberEmail) {
        return res.status(400).json({
            isError: true,
            data: null,
            developerMessage: "Missing required query parameters",
            userMessage: "Missing required parameters",
            moreInfo: null,
            responseCode: 10001,
            httpStatusCode: 400,
            errors: ["include and member.email are required parameters"],
            requestId: uuidv4()
        });
    }

    // Import response data
    const customerDetailsResponse = require('./sampleResponse/getCustomerDetails.json');

    res.status(200).json(customerDetailsResponse);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 