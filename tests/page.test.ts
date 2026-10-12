import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve(import.meta.dirname, "../index.html"), "utf8");
const doc = new DOMParser().parseFromString(html, "text/html");

describe("index.html", () => {
  it("[EX-1] shows Hello Devtronian as a large heading", () => {
    const heading = doc.querySelector("h1");
    expect(heading?.textContent).toBe("Hello Devtronian");
    expect(html).toMatch(/font-size:\s*6rem/);
  });

  it("[EX-2] centres the text on both axes whatever the window size", () => {
    expect(html).toMatch(/display:\s*flex/);
    expect(html).toMatch(/align-items:\s*center/);
    expect(html).toMatch(/justify-content:\s*center/);
    expect(html).toMatch(/min-height:\s*100vh/);
  });

  it("[EX-3] contains no text, button, menu or image besides the heading", () => {
    expect(doc.body.textContent?.replace(/\s+/g, " ").trim()).toBe("Hello Devtronian");
    expect(doc.querySelectorAll("button, nav, img, svg, a, input, ul, p, canvas, video")).toHaveLength(0);
  });

  it("[EX-4] needs no network: no scripts, links or remote URLs", () => {
    expect(doc.querySelectorAll("script, link, iframe")).toHaveLength(0);
    expect(html).not.toMatch(/https?:\/\//);
  });
});
