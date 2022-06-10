import joi from 'joi';

const schemaUrl = joi.object({
    url: joi.string().uri().required()
});

export default schemaUrl;