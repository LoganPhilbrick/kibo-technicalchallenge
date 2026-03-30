import { describe, it, expect } from "vitest";

import { truncateText } from "@/lib/truncate-text"

describe("truncateText", () => {
    it("should truncate text to the maximum length", () => {
        const text = "This is a test text";
        const maxLength = 10;
        const result = truncateText(text, maxLength);
        expect(result).toBe("This is a…");
        expect(result.length).toBe(maxLength);
    })
});