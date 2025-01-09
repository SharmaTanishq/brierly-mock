export const HOST = 'http://localhost:3000';

export const ROUTES = {
    AUTH: {
        path: '/auth/token',
        method: 'POST'
    },
    LOYALTY: {
        MEMBERS: {
            path: '/loyalty/members',
            method: 'POST'
        },
        GET_MEMBER: {
            path: '/api/v1/loyalty/members',
            method: 'GET'
        },
        MEMBER_REWARDS: {
            path: '/api/v1/loyalty/memberRewards',
            method: 'GET'
        }
        
    }
} as const; 