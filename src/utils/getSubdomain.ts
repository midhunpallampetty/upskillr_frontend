// export const getSubdomain = (): string | null => {
//   const host = window.location.hostname;
//   const parts = host.split('.');
//   if (parts.length >= 2 && parts[1] === 'localhost') {
//     return parts[0];
//   }
//   return null;
// };
// utils/getSubdomain.ts
export function getSubdomain(): string | null {
  if (typeof window === "undefined") return null; // SSR safety if needed
  const host = window.location.hostname; // e.g., "contact.eduvia.space"
  
  // Remove main domain "eduvia.space"
  const parts = host.split(".");
  
  // If it’s just "eduvia.space", no subdomain
  if (parts.length <= 2) return null;

  return parts[0]; // e.g., "contact"
}
