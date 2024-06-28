const schema = require("../schema")
const ExpressError = require("./ExpressError")

module.exports = validateListing = (req, res, next) => {

    const { error } = schema.listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg + " ,Listing Validaion Failed");
    } else {
        next();
    }
};