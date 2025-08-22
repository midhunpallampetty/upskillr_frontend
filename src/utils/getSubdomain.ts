export const getSubdomain = (): string | null => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 2 && parts[1] === 'localhost') {
    return parts[0];
  }
  return null;
};
