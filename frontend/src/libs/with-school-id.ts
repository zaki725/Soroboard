export const withSchoolId = (href: string, schoolId?: string): string => {
  if (!schoolId) return href;

  if (/[?&]schoolId=/.test(href)) return href;

  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}schoolId=${encodeURIComponent(schoolId)}`;
};
