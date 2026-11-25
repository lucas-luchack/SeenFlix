import { Router, type Request, type Response } from "express";

import { ValidationError } from "../errors/index.ts";
import { getMovieDetails, searchMovies } from "../services/movie.service.ts";

export const moviesRouter = Router();

moviesRouter.get("/search", async (req, res, next) => {
  try {
    const rawQuery = req.query.q;

    if (typeof rawQuery !== "string" || !rawQuery.trim()) {
      throw new ValidationError("Query parameter 'q' is required");
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
      throw new ValidationError("Parameter 'type' must be 'movie' or 'tv'");
    }

    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError("Parameter 'id' must be a positive integer");
    }

    const result = await getMovieDetails(type, id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
