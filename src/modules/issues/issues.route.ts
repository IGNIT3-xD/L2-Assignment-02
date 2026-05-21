import { Router } from "express";
import { createIssue, getAllIssues } from "./issues.controller";
import { authenticate } from "../../middleware/authenticate";

export const issueRoute = Router();

issueRoute.post('/', authenticate('contributor', 'maintainer'), createIssue)
issueRoute.get('/', getAllIssues)