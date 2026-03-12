import { Router, Response } from 'express';
import { AuthRequest, authenticateJWT } from '../middleware/auth';
import { tenantContext } from '../middleware/tenant';
import { TenantService } from '../services/tenant.service';

const router = Router();

// Apply auth and tenant context to all routes
router.use(authenticateJWT);
router.use(tenantContext);

router.get('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const tenant = await TenantService.getTenantDetails(req.user!.tenantId as string);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const updatedTenant = await TenantService.updateTenantDetails(req.user!.tenantId as string, req.body);
    res.json(updatedTenant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/members', async (req: AuthRequest, res: Response) => {
  try {
    const members = await TenantService.getTenantMembers(req.user!.tenantId as string);
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/members', async (req: AuthRequest, res: Response) => {
  try {
    const newMember = await TenantService.createMember(req.user!.tenantId as string, req.body);
    res.status(201).json(newMember);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
