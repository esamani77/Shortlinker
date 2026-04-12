import { Router } from "express";
import { validateBody } from "../middlewares/validations.middlewares";
import { createUrlSchema } from "../validations/url.validations";
import {
  createUrl,
  deleteUrl,
  getUrlByShortUrl,
} from "../services/url.services";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middlewares/auth.middlewares";
const router = Router();

router.post(
  "/create",
  validateBody(createUrlSchema),
  ensureAuthenticated,
  async (req, res) => {
    const { url, shortUrl } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const code = shortUrl || nanoid(6);
    const existingUrl = await getUrlByShortUrl(code);

    if (existingUrl) {
      return res.status(400).json({ error: "Short URL already exists" });
    }

    const newUrl = await createUrl({
      url,
      shortUrl: code,
      userId: req.user.id,
    });

    return res.status(201).json({ url: newUrl });
  },
);

router.delete("/:shortUrl", ensureAuthenticated, async (req, res) => {
  const shortUrl = req.params.shortUrl as string;
  const url = await getUrlByShortUrl(shortUrl);
  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }

  if (!req.user || url.userId !== req.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await deleteUrl(shortUrl, req.user.id);
  return res.status(200).json({ message: "URL deleted" });
});

router.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await getUrlByShortUrl(shortUrl);
  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }
  return res.status(200).json({ url });
});

export default router;
