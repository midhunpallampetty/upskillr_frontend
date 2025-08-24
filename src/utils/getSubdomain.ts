export const getSubdomain = (): string | null => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 2 && parts[1] === 'localhost') {
    return parts[0];
  }
  return null;
};
// export const getDynamicSubdomain = (): string | null => {
//   const host: string = window.location.hostname;
//   const parts: string[] = host.split('.');

//   // Handle local development (e.g., school.localhost)
//   if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
//     return parts[0]; // Returns "school"
//   }

//   // Handle production (e.g., gamersclub.eduvia.space)
//   if (parts.length >= 3 && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
//     return parts[0]; // Returns "gamersclub"
//   }

//   // Optional: Treat 'www' as no subdomain
//   if (parts.length >= 3 && parts[0] === 'www' && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
//     return null;
//   }

//   return null; // No subdomain (e.g., eduvia.space or localhost)
// };
export function getDynamicDomain(): string | null {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname; // e.g. gamersclub.eduvia.space
  const rootDomain = "eduvia.space";

  // If localhost (for dev)
  if (hostname.includes("localhost")) {
    return null; // treat as no subdomain
  }

  // Split hostname parts
  const parts = hostname.split(".");

  // If hostname === rootDomain or www.rootDomain → no subdomain
  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return null;
  }

  // Return the first part (subdomain)
  return parts[0]; // e.g. "gamersclub"
}
