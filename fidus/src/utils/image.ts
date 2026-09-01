/**
 * Injects Cloudinary transformation parameters into a raw URL.
 * Example:
 * Raw: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
 * Optimized (width 200): https://res.cloudinary.com/demo/image/upload/w_200,c_fill,q_auto/v1234/sample.jpg
 */
export const optimizeCloudinaryUrl = (url?: string, width: number = 200): string | undefined => {
    if (!url) return undefined;
    if (!url.includes('cloudinary.com') || !url.includes('/upload/')) {
        return url; // Return as-is if it's not a standard cloudinary upload URL
    }

    // Insert transformations right after /upload/
    const parts = url.split('/upload/');
    if (parts.length === 2) {
        return `${parts[0]}/upload/w_${width},c_fill,q_auto/${parts[1]}`;
    }

    return url;
};
