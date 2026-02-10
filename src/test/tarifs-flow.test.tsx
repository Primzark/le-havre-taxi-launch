import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Tarifs from "@/pages/Tarifs";

describe("Tarifs page", () => {
  it("filters prices and tours from query string", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/tarifs?q=honfleur"]}>
        <Tarifs />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Honfleur — One way/i)).toBeInTheDocument();
    expect(screen.queryByText(/Le Havre — City Centre/i)).not.toBeInTheDocument();
    expect(container.querySelector('a[href="/circuits-touristiques/5"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/circuits-touristiques/1"]')).not.toBeInTheDocument();
  });
});
