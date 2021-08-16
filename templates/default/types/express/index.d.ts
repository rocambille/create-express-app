declare namespace Express {
  interface Request {
    parse: Function;
    [key: string]: any;
  }
}
