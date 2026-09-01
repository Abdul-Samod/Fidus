export interface User {
    uuid: string;
    FullName: string;
    Email: string;
    Role: 'Client' | 'Artisan';
    KYC_Verified: boolean;
    WTA_Score: number;
    profilePicUrl?: string;
}

export interface Review {
    ReviewID: string;
    RequestID: string;
    ClientID: string;
    ArtisanID: string;
    Rating: number;
    ReviewComment: string;
    CreatedAt: string;
}

export interface ArtisanProfile {
    FullName: string;
    WTA_Score: number;
    KYC_Verified: boolean;
    kycDetails?: {
        profilePicUrl?: string;
    };
}

export interface Bid {
    BidID: string;
    RequestID: string;
    ArtisanID: string;
    ProposedPrice: string | number;
    Message: string;
    BidStatus: 'Pending' | 'Accepted' | 'Rejected' | 'Counter_Offered';
    CounterAmount?: string | number;
    CreatedAt: string;
    Artisan?: ArtisanProfile;
}

export interface EscrowTransaction {
    TransactionID: string;
    RequestID: string;
    AmountHeld: string | number;
    EscrowStatus: 'Pending' | 'Funded' | 'Released' | 'Refunded';
}

export interface ServiceRequest {
    RequestID: string;
    ClientID: string;
    Title: string;
    Description: string;
    LocationCoordinates: any; // GeoJSON
    PriceRange: any; // JSON { min, max }
    Status: 'Open' | 'Assigned' | 'Completed' | 'Cancelled';
    CreatedAt: string;
    Bids?: Bid[];
    Escrow_Transaction?: EscrowTransaction[];
    Reviews?: Review[];
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    status: 'success';
    message: string;
    data: T[];
    meta: PaginationMeta;
}
