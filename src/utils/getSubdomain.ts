export const getSubdomain = (): string | null => {
  const host: string = window.location.hostname; // e.g., "gamersclub.eduvia.space" or "savaipublicschool.localhost"
  const parts: string[] = host.split('.');

  // Handle local development (e.g., savaipublicschool.localhost)
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0]; // Returns "savaipublicschool"
  }

  // Handle production (e.g., gamersclub.eduvia.space)
  if (parts.length >= 3 && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
    return parts[0]; // Returns "gamersclub"
  }

  // Optional: Handle 'www' as main domain (treat as null if you don't want 'www' as a subdomain)
  if (parts.length >= 3 && parts[0] === 'www' && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
    return null; // Treat www.eduvia.space as main domain
  }

  return null; // No subdomain (e.g., eduvia.space or localhost)
};
