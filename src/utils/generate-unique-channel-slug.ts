import { prisma } from "../lib/prisma.js";

export const generateUniqueChannelSlug = async (name: string) => {
  const baseSlug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  let slug = baseSlug;
  let counter = 2;

  while (await prisma.channel.findUnique({ where: { slug } })) {
    slug = `${baseSlug}_${counter}`;
    counter++;
  }

  return slug;
};