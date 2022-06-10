import joi from 'joi';

const regexName = /^[a-zA-ZáéíóúàâêôãõüçÁÉÍÓÚÀÂÊÔÃÕÜÇ ]+$/;
const schemaSignUp = joi.object({
    name: joi.string().pattern(regexName).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.ref('password')
});

export default schemaSignUp;