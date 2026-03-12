import { Router, Response } from 'express';
import { AuthRequest, authenticateJWT } from '../middleware/auth';
import { tenantContext } from '../middleware/tenant';
import { IssueService } from '../services/issue.service';

const router = Router();

// Apply auth and tenant context to all routes
router.use(authenticateJWT);
router.use(tenantContext);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const issues = await IssueService.getIssues(req.user!.tenantId as string);
    res.json(issues);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const issue = await IssueService.createIssue({
      ...req.body,
      tenantId: req.user!.tenantId as string,
      reporterId: req.user!.userId as string,
    });
    res.status(201).json(issue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const issue = await IssueService.getIssueById(req.params.id, req.user!.tenantId as string);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const issue = await IssueService.updateIssue(req.params.id, req.user!.tenantId as string, req.body);
    res.json(issue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await IssueService.deleteIssue(req.params.id, req.user!.tenantId as string);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
