import { Router } from "express";
import { createIssue, getAllIssues, getSingleIssue } from "./issues.controller";
import { authenticate } from "../../middleware/authenticate";

export const issueRoute = Router();

issueRoute.post('/', authenticate('contributor', 'maintainer'), createIssue)
issueRoute.get('/', getAllIssues)
issueRoute.get('/:id', getSingleIssue)