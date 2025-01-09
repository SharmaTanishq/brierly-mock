import { BrierlyAuth } from './BrierlyAuth';
import { HOST, ROUTES } from '../routes';



const clientId = 'dummy-client-id-12345';
const clientSecret = 'dummy-client-secret-67890';

interface CouponResponse {
    isError: boolean;
    data: {
        rewards: {
            
                id: string;
                type: string;
                expired: boolean;
                redeemed: boolean;
                contentChannel: string;
                createDate: string;
                startDate: string;
                endDate: string;
            
            rewardContent: {
                id: string;
                type: string;
                name: string;
                description: string;
                imageUrl: string;
                termsAndConditions: string;
                barcode: {
                    type: string;
                    value: string;
                };
            };
        }[];
    };
    developerMessage: string | null;
    userMessage: string;
    moreInfo: string | null;
    responseCode: number;
    httpStatusCode: number;
    errors: string[] | null;
    requestId: string;
}

export class BrierlyCoupons {
    private auth: BrierlyAuth;

    constructor(auth: BrierlyAuth) {
        this.auth = auth;
    }

    async getActiveMemberCoupons(memberEmail: string): Promise<CouponResponse> {
        const token = await this.auth.getAuthToken(clientId, clientSecret);
        
        const response = await fetch(`${HOST}/api/v1/loyalty/memberRewards?rewardIdentity.expired=false&member.email=${memberEmail}&rewardIdentity.Redeemed=false&rewardIdentity.ContentChannel=Web`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }); 

        if (!response.ok) {
            throw new Error(`Failed to fetch coupons: ${response.status}`);
        }

        const data = await response.json() as any;

        
        // Map response data to standardized format
        const temp = data.data?.map((reward:any) => ({

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
        
        console.log(temp);


        return temp as any;
    }
}