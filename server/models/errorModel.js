class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode;
    }
}

/* HttpError = custom error class
extends Error = keeps all built-in error behavior. It inherits everything from JavaScript’s built-in Error class.
constructor = message → human-readable error message. errorCode → usually an HTTP status code (400, 401, 404, 500, etc.)
super(message) = initializes the base Error. This calls the parent class (Error) constructor. Without super(message), this cannot be used. It ensures error.message exists. Stack trace works correctly. this.code = stores HTTP status code */

module.exports = HttpError;