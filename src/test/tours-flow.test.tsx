import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Tours from "@/pages/Tours";

describe("Tours page", () => {
  it("links each circuit card to its detail route", () => {
    const { container } = render(
      <MemoryRouter>
        <Tours />
      </MemoryRouter>,
    );

    expect(container.querySelector('a[href="/circuits-touristiques/1"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/circuits-touristiques/7"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/circuits-touristiques/13"]')).toBeInTheDocument();
  });
});
