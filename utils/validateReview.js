const schema = require("../schema")
const ExpressError = require("./ExpressError");



module.exports = validateReview = (req, res, next) => {
    const { error } = schema.reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg+" ,Review Validaion Failed");
    } else {
        next();
    }
};