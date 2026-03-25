export function diffInDays(date1: Date, date2: Date): number {
    const msInDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / msInDay);
}

export function getAvatarInitials(name: string): string {
    if (!name || typeof name !== "string") return "?";
  
    // Normalize whitespace and split
    const parts = name.trim().split(/\s+/).filter(Boolean);
  
    if (parts.length === 0) return "?";
  
    if (parts.length === 1) {
      // Single name: take first two letters (uppercased)
      return parts[0].substring(0, 2).toUpperCase();
    }
  
    // Multiple names: take first of first and first of last
    const first = parts[0][0] || "";
    const last = parts[parts.length - 1][0] || "";
    return (first + last).toUpperCase();
  }
  