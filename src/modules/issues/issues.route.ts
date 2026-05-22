import { Router } from "express";
import { createIssue, deleteIssue, getAllIssues, getSingleIssue, updateIssue } from "./issues.controller";
import { authenticate } from "../../middleware/authenticate";

export const issueRoute = Router();

issueRoute.post('/', authenticate('contributor', 'maintainer'), createIssue)
issueRoute.get('/', getAllIssues)
issueRoute.get('/:id', getSingleIssue)
issueRoute.patch('/:id', authenticate('contributor', 'maintainer'), updateIssue)
issueRoute.delete('/:id', authenticate('maintainer'), deleteIssue)