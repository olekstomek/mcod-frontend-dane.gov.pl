/**
 * Static class
 * String Helper, helps manipulating strings
 */
export class StringHelper {

    /**
     * Provided string changes to camelCase. Useful for generating component names.
     * @param {string} text
     * @returns {string}
     */
    static toCamelCase(text: string): string {
        return text.replace(/(?:^\w|[A-Z]|-|\b\w)/g,
            (ltr, idx) => idx === 0
                ? ltr.toLowerCase()
                : ltr.toUpperCase()
        ).replace(/\s+|-/g, '');
    }

    /**
     * Always return string with uppercase first letter
     * @param {string} text
     * @returns {string}
     */
    static capitalizeFirstLetter(text: string): string {
        return text.trim().charAt(0).toUpperCase() + text.slice(1);
    }

    /**
     * Strips string from Html. Useful to remove html tags for description fields from backend formatted text
     * @param {string} text
     * @returns {string}
     */
    static stripHtmlTags(text: string) {
        return text.replace(/<\/?[^>]+(>|$)/g, '');
    }
}
