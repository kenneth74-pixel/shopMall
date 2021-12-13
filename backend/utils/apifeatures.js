class APIFeatures {
    constructor(query,querystring){
        this.query = query;
        this.querystring = querystring;
    }
    
    search(){
        const keyword = this.querystring.keyword?{
            name:{
                $regex: this.querystring.keyword,
                $options:'i'
            }
        }:{}
        console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.querystring};

        console.log(queryCopy);

        // Removing fields from the query
        const removeFields = ['keyword','limit','page']
        removeFields.forEach(el => delete this.queryCopy[el]);

        console.log(queryCopy);

        // Advance filter for price,ratings etc
        let querystring = json.stringify(queryCopy)
        querystring = querystring.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query = this.query.find(json.parse(querystring));
        return this;
    }

    paginations(resultPerPage){
        const currentPage = Number(this.querystring.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.limit(resultPerPage).skip(skip)
        return this;

    }
}

module.exports = APIFeatures;