import { Router } from 'express';
import {
  getDDragonVersion,
  getChampions,
  getChampionDetail,
  getItems,
  getPerks,
} from '../controllers/ddragonController';

const router = Router();

// GET /api/ddragon/version - Current DDragon patch version
router.get('/version', getDDragonVersion);

// GET /api/ddragon/champions - All champions (Vietnamese)
router.get('/champions', getChampions);

// GET /api/ddragon/champions/:championId - Single champion detail
router.get('/champions/:championId', getChampionDetail);

// GET /api/ddragon/items - All items (Vietnamese)
router.get('/items', getItems);

// GET /api/ddragon/perks - All perks & runes (CommunityDragon)
router.get('/perks', getPerks);

export default router;
