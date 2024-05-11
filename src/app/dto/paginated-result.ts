export class PaginatedResult<T> {
    count: number;
    next: string;
    previous: string;
    results: T[];

    // extra fields
    header: any;
}
