/**
 * Formats a numeric value as currency based on the provided currency code and locale.
 * @param {number} amount - The numeric value to format.
 * @param {string} currencyCode - The ISO 4217 currency code (e.g., 'INR', 'USD', 'EUR').
 * @param {string} locale - The locale string (e.g., 'en-IN', 'en-US'). Defaults to 'en-IN'.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, currencyCode = 'INR', locale = 'en-IN') => {
    try {
        // Map common currencies to their default locales if not provided
        const localeMap = {
            'INR': 'en-IN',
            'USD': 'en-US',
            'EUR': 'de-DE',
            'GBP': 'en-GB',
            'JPY': 'ja-JP',
            'CAD': 'en-CA',
            'AUD': 'en-AU'
        };

        const targetLocale = locale || localeMap[currencyCode] || 'en-US';

        return new Intl.NumberFormat(targetLocale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (error) {
        console.error('Currency formatting error:', error);
        return `${currencyCode} ${amount}`;
    }
};

export const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];
