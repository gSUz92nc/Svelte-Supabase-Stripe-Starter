import { PUBLIC_SITE_URL } from '$env/static/public';

/**
 * Constructs a full URL by combining the site URL with a given path
 * @param {string} path - Path to append to the site URL
 * @returns {string} Complete URL
 */
export const getURL = (path: string = ''): string => {
	// Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
	let url =
		PUBLIC_SITE_URL.trim() !== ''
			? PUBLIC_SITE_URL
			: // If PUBLIC_SITE_URL not set, default to localhost for local development.
				'http://localhost:3000/';

	// Trim the URL and remove trailing slash if exists.
	url = url.replace(/\/+$/, '');
	// Make sure to include `https://` when not localhost.
	url = url.includes('http') ? url : `https://${url}`;
	// Ensure path starts without a slash to avoid double slashes in the final URL.
	path = path.replace(/^\/+/, '');

	// Concatenate the URL and the path.
	return path ? `${url}/${path}` : url;
};



/**
 * Converts Unix timestamp to DateTime
 * @param {number} secs - Unix timestamp in seconds
 * @returns {Date} JavaScript Date object
 */
export const toDateTime = (secs: number): Date => {
	var t = new Date(+0); // Unix epoch start.
	t.setSeconds(secs);
	return t;
};

/**
 * Calculates the trial end timestamp for subscriptions
 * @param {number|null|undefined} trialPeriodDays - Number of trial days
 * @returns {number|undefined} Unix timestamp for trial end or undefined
 */
export const calculateTrialEndUnixTimestamp = (trialPeriodDays: number | null | undefined): number | undefined => {
	// Check if trialPeriodDays is null, undefined, or less than 2 days
	if (trialPeriodDays === null || trialPeriodDays === undefined || trialPeriodDays < 2) {
		return undefined;
	}

	const currentDate = new Date(); // Current date and time
	const trialEnd = new Date(currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000); // Add trial days
	return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};