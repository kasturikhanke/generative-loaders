import { act, cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImageLoader, InlineLoader, TextLoader, type ImageLoaderVariant, type InlineLoaderVariant, type TextLoaderVariant } from "../src/index.js";

let reducedMotion = false;

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, useReducedMotion: () => reducedMotion };
});

afterEach(() => {
  cleanup();
  reducedMotion = false;
});

const variants: TextLoaderVariant[] = [
  "decode", "typewriter", "skeleton", "cascade", "focus", "wipe",
  "flip", "redact", "line", "terminal", "wave", "dissolve",
  "slice", "tracking", "coalesce", "fragments",
];

const inlineVariants: InlineLoaderVariant[] = [
  "glyph", "matrix", "orbit", "ripple", "signal", "spark", "rotor",
  "pixel-drift", "chomp", "snake", "fold", "gravity", "domino", "aperture",
  "dot-pulse", "vortex", "halo", "count-up",
];

const imageVariants: ImageLoaderVariant[] = [
  "skeleton", "bands", "tiles", "scan", "pixel-grid", "resolution", "focus", "shutter",
];

describe("ImageLoader", () => {
  it("renders every image variant on the server", () => {
    for (const variant of imageVariants) {
      const html = renderToString(<ImageLoader variant={variant} />);
      expect(html).toContain(`data-variant="${variant}"`);
      expect(html).toContain('aria-label="Generating image"');
    }
  });

  it("normalizes presentation props and exposes a custom status", () => {
    render(<ImageLoader variant="bands" size={144} radius={12} speed={0} color="#123456" paused className="example" label="Rendering preview" />);
    const loader = screen.getByRole("status", { name: "Rendering preview" });
    expect(loader).toHaveAttribute("data-speed", "1");
    expect(loader).toHaveAttribute("data-paused", "true");
    expect(loader).toHaveClass("iml-loader", "example");
    expect(loader).toHaveStyle("--iml-size: 144px");
    expect(loader).toHaveStyle("--iml-radius: 12px");
    expect(loader).toHaveStyle("--iml-color: #123456");
  });

  it("stops motion when reduced motion is requested", () => {
    reducedMotion = true;
    render(<ImageLoader variant="scan" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-paused", "true");
  });

  it("sequences image cells in the direction their result resolves", () => {
    const { container, rerender } = render(<ImageLoader variant="tiles" />);
    const tileDelays = Array.from(container.querySelectorAll<HTMLElement>(".iml-tiles i"), (cell) => parseFloat(cell.style.getPropertyValue("--iml-delay")));
    expect(tileDelays[5]).toBeLessThan(tileDelays[0]);

    rerender(<ImageLoader variant="pixel-grid" />);
    const pixelDelays = Array.from(container.querySelectorAll<HTMLElement>(".iml-pixel-grid i"), (cell) => parseFloat(cell.style.getPropertyValue("--iml-delay")));
    expect(pixelDelays[0]).toBeLessThan(pixelDelays.at(-1)!);

    rerender(<ImageLoader variant="resolution" />);
    const resolutionDelays = Array.from(container.querySelectorAll<HTMLElement>(".iml-resolution i"), (cell) => parseFloat(cell.style.getPropertyValue("--iml-delay")));
    expect(resolutionDelays[14]).toBeLessThan(resolutionDelays[0]);
  });

});

describe("InlineLoader", () => {
  it("renders every inline variant on the server", () => {
    for (const variant of inlineVariants) {
      const html = renderToString(<InlineLoader variant={variant} />);
      expect(html).toContain(`data-variant="${variant}"`);
      expect(html).toContain('aria-hidden="true"');
    }
  });

  it("supports an accessible standalone status", () => {
    render(<InlineLoader variant="matrix" label="Thinking" />);
    expect(screen.getByRole("status", { name: "Thinking" })).toBeInTheDocument();
  });

  it("gives spark and aperture distinct visual structures", () => {
    const { container, rerender } = render(<InlineLoader variant="spark" />);
    expect(container.querySelectorAll(".il-spark i")).toHaveLength(3);
    expect(container.querySelector(".il-spark b")).not.toBeInTheDocument();

    rerender(<InlineLoader variant="aperture" />);
    expect(container.querySelectorAll(".il-aperture i")).toHaveLength(6);
    expect(container.querySelector(".il-aperture b")).toBeInTheDocument();
  });

  it("draws the rotor with three precise rings and a centered hub", () => {
    const { container } = render(<InlineLoader variant="rotor" />);
    expect(container.querySelectorAll(".il-rotor-ring")).toHaveLength(3);
    expect(container.querySelector(".il-rotor-spokes")).toBeInTheDocument();
    expect(container.querySelector(".il-rotor-hub")).toBeInTheDocument();
  });

  it("renders the dot studies with distinct compositions", () => {
    const { container, rerender } = render(<InlineLoader variant="dot-pulse" />);
    const pulseDots = container.querySelectorAll<HTMLElement>(".il-dot-pulse i");
    expect(pulseDots).toHaveLength(4);
    expect(pulseDots[0].style.getPropertyValue("--il-i")).toBe("3");
    expect(pulseDots[3].style.getPropertyValue("--il-i")).toBe("0");

    rerender(<InlineLoader variant="vortex" />);
    expect(container.querySelectorAll(".il-vortex i")).toHaveLength(36);
    expect(container.querySelector(".il-vortex b")).toBeInTheDocument();

    rerender(<InlineLoader variant="halo" />);
    expect(container.querySelectorAll(".il-halo i")).toHaveLength(8);
  });

  it("counts through every integer from zero to one hundred", () => {
    vi.useFakeTimers();
    const { container } = render(<InlineLoader variant="count-up" />);
    const counter = container.querySelector(".il-count-up");

    expect(counter).toHaveTextContent("0");
    for (let value = 1; value <= 100; value += 1) {
      act(() => vi.advanceTimersByTime(45));
      expect(counter).toHaveTextContent(String(value));
    }
    vi.useRealTimers();
  });

  it("normalizes sizing, speed, color, pause, and classes", () => {
    render(<InlineLoader variant="signal" size={28} speed={0} color="#123456" paused className="example" label="Loading" />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("data-speed", "1");
    expect(loader).toHaveAttribute("data-paused", "true");
    expect(loader).toHaveClass("il-loader", "example");
    expect(loader).toHaveStyle("--il-size: 28px");
    expect(loader).toHaveStyle("--il-color: #123456");
  });

  it("stops motion when reduced motion is requested", () => {
    reducedMotion = true;
    render(<InlineLoader variant="glyph" label="Working" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-paused", "true");
  });
});

describe("TextLoader", () => {
  it("renders every variant on the server without browser globals", () => {
    for (const variant of variants) {
      const html = renderToString(<TextLoader text="Streaming text" variant={variant} />);
      expect(html).toContain(`data-variant="${variant}"`);
      expect(html).toContain("role=\"status\"");
    }
  });

  it("exposes the currently received text to assistive technology", () => {
    render(<TextLoader text={"Ideas arrive\nwith rhythm."} variant="decode" />);
    expect(screen.getByRole("status", { name: "Ideas arrive with rhythm." })).toBeInTheDocument();
  });

  it("allows an explicit accessible label override", () => {
    render(<TextLoader text="Visible text" variant="focus" aria-label="Generating response" />);
    expect(screen.getByRole("status", { name: "Generating response" })).toBeInTheDocument();
  });

  it("applies color, speed, pause, and custom classes", () => {
    render(<TextLoader text="Hello" variant="wave" color="#123456" speed={1.5} paused className="example" />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("data-speed", "1.5");
    expect(loader).toHaveAttribute("data-paused", "true");
    expect(loader).toHaveClass("tl-loader", "example");
    expect(loader).toHaveStyle("--tl-color: #123456");
  });

  it("normalizes invalid speeds to the default", () => {
    render(<TextLoader text="Hello" variant="terminal" speed={0} />);
    expect(screen.getByRole("status")).toHaveAttribute("data-speed", "1");
  });

  it("renders only the text that has actually arrived", () => {
    const { container, rerender } = render(<TextLoader text="" variant="typewriter" />);
    expect(container.querySelector(".tl-typewriter")).toHaveTextContent("");
    expect(screen.getByRole("status")).toHaveAttribute("data-received-length", "0");

    rerender(<TextLoader text="Hello" variant="typewriter" />);
    expect(container.querySelector(".tl-typewriter")).toHaveTextContent("Hello");
    expect(container.querySelector(".tl-typewriter")).not.toHaveTextContent("world");
    expect(screen.getByRole("status")).toHaveAttribute("data-received-length", "5");
  });

  it("preserves existing character nodes when a new chunk is appended", () => {
    const { container, rerender } = render(<TextLoader text="Hello" variant="typewriter" />);
    const firstCharacter = container.querySelector(".tl-typewriter .tl-char");

    rerender(<TextLoader text="Hello world" variant="typewriter" />);
    expect(container.querySelector(".tl-typewriter")).toHaveTextContent("Hello world");
    expect(container.querySelector(".tl-typewriter .tl-char")).toBe(firstCharacter);
  });

  it("shows received text without an entrance animation while paused", () => {
    const { container } = render(<TextLoader text="Hello" variant="typewriter" paused />);
    expect(container.querySelector(".tl-typewriter")).toHaveTextContent("Hello");
  });

  it("shimmers while skeleton text is pending, then reveals the received passage", () => {
    const { container, rerender } = render(<TextLoader text="" variant="skeleton" />);
    expect(container.querySelectorAll(".tl-skeleton i")).toHaveLength(2);
    expect(container.querySelector(".tl-skeleton-stream")).not.toBeInTheDocument();

    rerender(<TextLoader text="Loading words" variant="skeleton" />);
    expect(container.querySelector(".tl-skeleton")).not.toBeInTheDocument();
    expect(container.querySelector(".tl-skeleton-stream")).toHaveTextContent("Loading words");
  });

  it("assembles dissolve glyphs from a rightward particle cloud", () => {
    const { container } = render(<TextLoader text="Dust" variant="dissolve" />);
    const glyphs = container.querySelectorAll(".tl-dissolve-char");
    const particles = glyphs[0]?.querySelectorAll("i") ?? [];

    expect(glyphs).toHaveLength(4);
    expect(particles).toHaveLength(6);
    expect(particles[0]).toHaveStyle("transform: translateX(30px) translateY(-11px) scale(0.35)");
  });

  it("immediately renders received text when reduced motion is requested", () => {
    reducedMotion = true;
    const { container } = render(<TextLoader text="Finished sentence" variant="typewriter" />);
    expect(container.querySelector(".tl-typewriter")).toHaveTextContent("Finished sentence");
    expect(screen.getByRole("status")).toHaveAttribute("data-paused", "true");
  });
});
