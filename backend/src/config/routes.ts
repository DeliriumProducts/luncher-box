import { Request, Response, Application } from "express";

export default (app: Application) => {
  app.get("/", (req: Request, res: Response) => {
      res.json("hello uwu");
  });
};
