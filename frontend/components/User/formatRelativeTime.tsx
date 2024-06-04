export const formatRelativeTime = (dateString: any) => {
    const date: any = new Date(dateString);
    const now: any = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (seconds < 60) {
        return "Just now";
    } else if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else if (days < 7) {
        return `${days}d ago`;
    } else if (weeks < 4) {
        return `${weeks}w ago`;
    } else if (months < 12) {
        return `${months}mo ago`;
    } else {
        return `${years}y ago`;
    }
    }
    