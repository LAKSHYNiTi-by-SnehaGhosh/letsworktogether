import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes an input string to prevent XSS attacks.
 * By default, this strips all HTML tags and leaves only text content.
 * Adjust the DOMPurify configuration here if you need to allow specific tags.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return input;

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip everything by default
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitizes HTML content, allowing a safe subset of tags.
 * Use this when the user is expected to input rich text.
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== "string") return html;
  return DOMPurify.sanitize(html);
}
