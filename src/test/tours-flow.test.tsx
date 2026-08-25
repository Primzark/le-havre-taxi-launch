import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Tours from "@/pages/Tours";
import TourDetail from "@/pages/TourDetail";

const memoryRouterFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe("Tours page", () => {
  it("links each circuit card to its detail route", () => {
    const { container } = render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Tours />
      </MemoryRouter>,
    );

    expect(container.querySelector('a[href="/circuits-touristiques/1"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/circuits-touristiques/7"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/circuits-touristiques/13"]')).toBeInTheDocument();
  });

  it("links tours to the practical pricing and contact pages", () => {
    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Tours />
      </MemoryRouter>,
    );

    const main = screen.getByRole("main");

    expect(main.querySelector('a[href="/tarifs"]')).toBeInTheDocument();
    expect(main.querySelector('a[href^="/contact?"]')).toBeInTheDocument();
  });

  it("links a tour to pricing, prefilled contact, and a phone call", () => {
    render(
      <MemoryRouter initialEntries={["/circuits-touristiques/2"]} future={memoryRouterFutureConfig}>
        <Routes>
          <Route path="/circuits-touristiques/:id" element={<TourDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    const bookingLink = screen.getByRole("link", { name: /Réserver ce circuit/i });
    const href = bookingLink.getAttribute("href") ?? "";
    const subject = new URLSearchParams(href.split("?")[1]).get("subject");

    expect(href.startsWith("/contact?")).toBe(true);
    expect(subject).toBe("Réservation circuit N°2 - Étretat");
    const main = screen.getByRole("main");

    expect(main.querySelector('a[href="/tarifs"]')).toBeInTheDocument();

    const callLink = within(main).getByRole("link", { name: /appeler/i });
    expect(callLink).toHaveAttribute("href", expect.stringMatching(/^tel:/));
  });
});
