const joi = require("joi")

exports.listingSchema = joi.object(
    {
        listing : joi.object(
            {
                title:joi.string().required(),
                description:joi.string().required(),
                location:joi.string().required(),
                country:joi.string().required(),
                price:joi.number().required().min(0)
            }
        ).required()
    }
);


exports.reviewSchema = joi.object({
    review : joi.object(
        {
            ratings:joi.number().min(0).max(5).required(),
            comment:joi.string().required()
        }
    ).required()
});

