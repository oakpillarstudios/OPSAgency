/**
 * Frontend Google Analytics Event Tracker Helpers
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track Page Views
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'PASTE_YOUR_GA_MEASUREMENT_ID_HERE') {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Track Custom Event Triggers
export interface TrackEventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function trackEvent({ action, category, label, value }: TrackEventParams) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
