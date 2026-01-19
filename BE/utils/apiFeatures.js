export class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Filter
    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'search', 'sort', 'limit'];
        excludeFields.forEach((field) => delete queryObj[field]);

        this.query = this.query.find(queryObj);
        return this;
    }

    // Search
    search(fields) {
        if  (this.queryString.search) {
            const searchQuery = {
                $or: fields.map(field => ({
                    [field]: {
                        $regex: this.queryString.search,
                        $options: 'i'
                    }
                }))
            };
            this.query = this.query.find(searchQuery);
        }
        return this;
    }

    // Sort
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort
            .split(',')
            .join(' ');

            this.query = this.query.sort(sortBy);
        } 
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    //  Pagination
    paginate() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        total, 
        page,
        limit,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages
    };
}