class AppError {
  message: string;
  statusCode: number;

  constructor(messsage: string, statusCode: number = 400) {
    this.message = messsage;
    this.statusCode = statusCode;
  }
}

export { AppError };
