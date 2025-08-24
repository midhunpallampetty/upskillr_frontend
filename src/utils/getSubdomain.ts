export const getSubdomain = (): string | null => {
  const host = window.location.hostname; // e.g., "gamersclub.eduvia.space" or "school.localhost"
  const parts = host.split(".");

  // ✅ Handle localhost (school.localhost → "school")
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    return parts[0];
  }

  // ✅ Handle production (gamersclub.eduvia.space → "gamersclub")
  if (parts.length > 2) {
    return parts[0];
  }

  return null; // root domain → no subdomain
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
