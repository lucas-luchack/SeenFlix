import { Router, type Request, type Response } from "express";
import { getMovieDetails, searchMovies } from "../services/movieService.ts";

export const moviesRouter = Router();

class AppError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "AppError";
  }
}


moviesRouter.get("/search", async (req, res, next) => {
  try {
    const rawQuery = req.query.q;

    if (typeof rawQuery !== "string" || !rawQuery.trim()) {
      throw new AppError(400, "VALIDATION_ERROR", "Query parameter 'q' is required");
    }

    const result = await searchMovies(rawQuery);
    res.json(result);
  } catch (error) {
    next(error); 
  }
});

moviesRouter.get("/:type/:id", async (req: Request, res: Response, next) => {
  try {
    const { type, id: rawId } = req.params;

    if (type !== "movie" && type !== "tv") {
      throw new AppError(400, "VALIDATION_ERROR", "Parameter 'type' must be 'movie' or 'tv'");
    }

    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "VALIDATION_ERROR", "Parameter 'id' must be a positive integer");
    }

    const result = await getMovieDetails(type, id);
    res.json(result);
  } catch (error) {
    next(error); // Transmet l'erreur au middleware global d'Express
  }
});
