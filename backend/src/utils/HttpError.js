class HttpError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }

  setStatus(status) {
    this.status = status;
    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }
}

export default HttpError;
