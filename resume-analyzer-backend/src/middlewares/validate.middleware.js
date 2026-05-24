import AppError from "../shared/errors/AppError.js";

/**
 * Generic request validation middleware
 * @param {Object} schema - Joi schema
 * @param {String} property - request property to validate (body, params, query)
 */
export function validate(schema, property = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // return all errors
      stripUnknown: true, // remove extra fields
    });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));

      return next(
        new AppError("Validation failed", 400, formattedErrors)
      );
    }

    // Replace request data with sanitized version
    req[property] = value;

    next();
  };
}
