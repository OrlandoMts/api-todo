import { Types } from 'mongoose';

export class APIFeatures {
  public mongooseQuery: any;
  public queryString: any;

  constructor(mongooseQuery: any, queryString: any) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  public filter() {
    // 1) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const parsedQueryObj = JSON.parse(queryStr);

    // 3) Ensure status is true
    parsedQueryObj.status = true;

    // 4) Date Filtering for limitDate
    if (parsedQueryObj.limitDate) {
      const date = new Date(parsedQueryObj.limitDate);
      parsedQueryObj.limitDate = {
        $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(date.setUTCHours(24, 0, 0, 0)),
      };
    }

    // 5) Text search for partial words
    Object.keys(parsedQueryObj).forEach(key => {
      if (
        typeof parsedQueryObj[key] === 'string' &&
        key !== 'author' &&
        key !== 'limitDate' &&
        key !== 'completed'
      ) {
        parsedQueryObj[key] = { $regex: parsedQueryObj[key], $options: 'i' };
      }
    });

    // 6) Convert author ID to ObjectId
    if (parsedQueryObj.author) {
      parsedQueryObj.author = new Types.ObjectId(
        parsedQueryObj.author as string,
      );
    }

    this.mongooseQuery = this.mongooseQuery.find(parsedQueryObj);

    return this;
  }

  public sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }

    return this;
  }

  public limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }

    return this;
  }

  public pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 25;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }
}
