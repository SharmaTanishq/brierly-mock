import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BrierlyAuth } from './Brierly/BrierlyAuth';
import { BrierlyCoupons } from './Brierly/BrierlyCoupons';

import createCustomerObject from './sampleResponse/createCustomer'; 
//@ts-ignore
import test from './sampleResponse/getMemberActiveCoupons';
import customerCreatedResponse from './sampleResponse/customerCreatedResponse';
import getMemberActiveCoupons from './sampleResponse/getMemberActiveCoupons';
import getCustomerDetails from './sampleResponse/getCustomerDetails';
import memberRewardsSummary from './sampleResponse/memberRewardsSummary';
import redeemedRewardResponse from './sampleResponse/redeemedRewardResponse';

const app = express();
const PORT = 3000;

// API Documentation
const apiEndpoints = [
    {
        Method: 'GET',
        Path: '/health',
        Description: 'Health check endpoint to verify service status'
    },
    {
        Method: 'POST',
        Path: '/api/v1/auth/token',
        Description: 'Authenticate and get access token using client credentials'
    },
    {
        Method: 'POST',
        Path: '/api/v1/loyalty/members',
        Description: 'Create a new loyalty member with email and profile details'
    },
    {
        Method: 'GET',
        Path: '/api/v1/loyalty/memberRewards',
        Description: 'Retrieve member rewards using member email'
    },
    {
        Method: 'GET', 
        Path: '/api/v1/loyalty/members',
        Description: 'Get customer details using member email'
    },
    {
        Method: 'GET',
        Path: '/api/v1/loyalty/memberRewards?rewardIdentity.expired=false&member.email=newtest.account@test.com&rewardIdentity.Redeemed=false&rewardIdentity.ContentChannel=Web',
        Description: 'Get active coupons and rewards for a member'
    },
    {
        Method: 'GET',
        Path: '/api/v1/loyalty/memberRewards/summary',
        Description: 'Get summary of member rewards with options for unredeemed and unexpired rewards'
    },
    {
        Method: 'PATCH',
        Path: '/api/v1/loyalty/memberRewards/:rewardId/redeem',
        Description: 'Redeem a specific reward for a member using the reward ID'
    }
];

// Display API Documentation
console.log('\n=== Available API Endpoints ===\n');
console.table(apiEndpoints);

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
app.post('/api/v1/auth/token', (req: any, res: any) => {
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
app.post('/api/v1/loyalty/members', (req: Request, res: Response) => {
    // Get bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            isError: true,
            data: null,
            developerMessage: "Missing or invalid authorization token",
            userMessage: "Unauthorized access",
            moreInfo: null,
            responseCode: 10003,
            httpStatusCode: 401,
            errors: ["Valid bearer token is required"],
            requestId: uuidv4()
        });
    }

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

    
    res.status(201).json(getCustomerDetails);
    
});

// Get Member Rewards endpoint
// app.get('/api/v1/loyalty/memberRewards', (req: any, res: any) => {
//     const { 'member.email': memberEmail } = req.query;

//     // Check if required email parameter is present
//     if (!memberEmail) {
//         return res.status(400).json({
//             isError: true,
//             data: null,
//             developerMessage: "Missing required query parameter",
//             userMessage: "Missing required parameter",
//             moreInfo: null,
//             responseCode: 10001,
//             httpStatusCode: 400,
//             errors: ["member.email is a required parameter"],
//             requestId: uuidv4()
//         });
//     }

//     // Import response data
//     const memberRewardsResponse = require('./sampleResponse/retreiveMemberCoupons.json');

//     res.status(200).json(memberRewardsResponse);
// });


// Get Customer Details endpoint
app.get('/api/v1/loyalty/members', (req: any, res: any) => {
    // Get bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            isError: true,
            data: null,
            developerMessage: "Missing or invalid authorization token",
            userMessage: "Unauthorized access",
            moreInfo: null,
            responseCode: 10003,
            httpStatusCode: 401,
            errors: ["Valid bearer token is required"],
            requestId: uuidv4()
        });
    }

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
    
    res.status(200).json(getCustomerDetails);
});


// Get Active Coupons endpoint

// Get Member Rewards Summary endpoint
app.get('/api/v1/loyalty/memberRewards/summary', (req: any, res: any) => {
    const { 
        'member.email': memberEmail,
        'options.UnRedeemedOnly': unRedeemedOnly,
        'options.UnexpiredOnly': unexpiredOnly 
    } = req.query;

    // Get bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            isError: true,
            data: null,
            developerMessage: "Missing or invalid authorization token",
            userMessage: "Unauthorized access",
            moreInfo: null,
            responseCode: 10003,
            httpStatusCode: 401,
            errors: ["Valid bearer token is required"],
            requestId: uuidv4()
        });
    }

    // Check if required query parameters are present
    if (!memberEmail || unRedeemedOnly === undefined || unexpiredOnly === undefined) {
        return res.status(400).json({
            isError: true,
            data: null,
            developerMessage: "Missing required query parameters",
            userMessage: "Missing required parameters", 
            moreInfo: null,
            responseCode: 10001,
            httpStatusCode: 400,
            errors: ["member.email, options.UnRedeemedOnly, and options.UnexpiredOnly are required parameters"],
            requestId: uuidv4()
        });
    }

    // Import response data
    

    res.status(200).json(getMemberActiveCoupons);
});


app.get('/api/v1/loyalty/memberRewards', (req: any, res: any) => {
    const { 
        'rewardIdentity.expired': expired,
        'member.email': memberEmail,
        'rewardIdentity.Redeemed': redeemed,
        'rewardIdentity.ContentChannel': contentChannel
    } = req.query;

    // Get bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            isError: true,
            data: null,
            developerMessage: "Missing or invalid authorization token",
            userMessage: "Unauthorized access",
            moreInfo: null,
            responseCode: 10003,
            httpStatusCode: 401,
            errors: ["Valid bearer token is required"],
            requestId: uuidv4()
        });
    }

    // Check if required query parameters are present
    if (!memberEmail || expired === undefined || redeemed === undefined || !contentChannel) {
        return res.status(400).json({
            isError: true,
            data: null,
            developerMessage: "Missing required query parameters",
            userMessage: "Missing required parameters",
            moreInfo: null,
            responseCode: 10001,
            httpStatusCode: 400,
            errors: ["member.email, rewardIdentity.expired, rewardIdentity.Redeemed, and rewardIdentity.ContentChannel are required parameters"],
            requestId: uuidv4()
        });
    }

    // Import response data
    
    console.log('Customer object:', customerCreatedResponse);
    const temp = test.data?.map((reward:any) => ({

        id: reward.id,
        code: reward.id,            
        "currencyCode": "USD",
        "customCreditType": 'AR',
        "creditType": 'Custom',
        "initialBalance": 5,
        "currentBalance": 5,
        "isEnabled": true,
        "activationDate": reward.createDate,            
        
    }));
    
    


    
    res.status(200).json(getMemberActiveCoupons);
});


// Demo endpoint to test BrierlyCoupons integration
app.get('/api/v1/demo/memberCoupons', async (req: any, res: any) => {
    try {
        const {
            'rewardIdentity.expired': expired = 'false',
            'member.email': memberEmail = 'newtest.account@test.com', 
            'rewardIdentity.Redeemed': redeemed = 'false',
            'rewardIdentity.ContentChannel': contentChannel = 'Web'
        } = req.query;
        

        if (!memberEmail) {
            return res.status(400).json({
                isError: true,
                data: null,
                developerMessage: "Missing email parameter",
                userMessage: "Email is required",
                moreInfo: null,
                responseCode: 10001,
                httpStatusCode: 400,
                errors: ["email query parameter is required"],
                requestId: uuidv4()
            });
        }

        const auth = new BrierlyAuth();
        const coupons = new BrierlyCoupons(auth);
        const response = await coupons.getActiveMemberCoupons(memberEmail);

        res.status(200).json(response);

    } catch (error) {
        console.error('Error in demo coupons endpoint:', error);
        res.status(500).json({
            isError: true,
            data: null,
            developerMessage: error instanceof Error ? error.message : "Unknown error occurred",
            userMessage: "Failed to fetch coupons",
            moreInfo: null,
            responseCode: 10002,
            httpStatusCode: 500,
            errors: ["Internal server error"],
            requestId: uuidv4()
        });
    }
});

// Redeem Member Reward endpoint
app.patch('/api/v1/loyalty/memberRewards/:rewardId/redeem', (req: any, res: any) => {
    const { rewardId } = req.params;

    // Get bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            isError: true,
            data: null,
            developerMessage: "Missing or invalid authorization token",
            userMessage: "Unauthorized access",
            moreInfo: null,
            responseCode: 10003,
            httpStatusCode: 401,
            errors: ["Valid bearer token is required"],
            requestId: uuidv4()
        });
    }

    // Validate rewardId
    if (!rewardId) {
        return res.status(400).json({
            isError: true,
            data: null,
            developerMessage: "Missing reward ID",
            userMessage: "Reward ID is required",
            moreInfo: null,
            responseCode: 10001,
            httpStatusCode: 400,
            errors: ["rewardId is required"],
            requestId: uuidv4()
        });
    }

    // Import response data
    

    res.status(200).json(redeemedRewardResponse);
});






app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 