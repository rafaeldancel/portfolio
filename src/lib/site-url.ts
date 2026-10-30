// Set NEXT_PUBLIC_SITE_URL in the Vercel project env to the production origin.
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
