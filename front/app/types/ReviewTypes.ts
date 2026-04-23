export interface Review {
    reviewId: number;
    account: number | { acctId: number; name?: string; email?: string; [key: string]: unknown };
    title: string;
    bodyOfText: string;
    stars: number;
    car: string | { vin: string; [key: string]: unknown };
    rentalDuration: number;
    publishedDate: string;
}
