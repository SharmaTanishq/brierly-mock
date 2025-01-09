import { HOST, ROUTES } from '../routes';

interface AuthResponse {
    isError: boolean;
    data: {
        tokenType: string;
        accessToken: string;
        expiresIn: number;
    };
    developerMessage: string | null;
    userMessage: string;
    moreInfo: string | null;
    responseCode: number;
    httpStatusCode: number;
    errors: string[] | null;
    requestId: string;
}

export class BrierlyAuth {
    private token: string | null;
    private tokenExpiry: Date | null;

    constructor() {
        this.token = null;
        this.tokenExpiry = null;
    }

    async getAuthToken(clientId: string, clientSecret: string): Promise<string> {
        // Return existing token if it's still valid
        if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.token;
        }

        try {
            const response = await fetch(`${HOST}${ROUTES.AUTH.path}`, {
                method: ROUTES.AUTH.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId,
                    clientSecret,
                }),
            });

            if (!response.ok) {
                throw new Error(`Auth request failed with status ${response.status}`);
            }

            const authData = await response.json() as AuthResponse;
            
            // Save token and set expiry
            this.token = authData.data.accessToken;
            this.tokenExpiry = new Date(Date.now() + (authData.data.expiresIn * 1000));
            
            return this.token;
        } catch (error) {
            console.error('Error getting Brierly auth token:', error);
            throw error;
        }
    }

    clearToken(): void {
        this.token = null;
        this.tokenExpiry = null;
    }

    
} 