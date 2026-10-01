import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

const memoryRouterFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe("Header search form", () => {
  it("explains how to continue when submitted without a search term", async () => {
    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <>
          <Header />
          <Toaster />
        </>
      </MemoryRouter>,
    );

    const search = screen.getByLabelText("Recherche menu");
    fireEvent.submit(search.closest("form")!);

    expect(await screen.findByText("Saisissez un terme pour lancer la recherche.")).toBeInTheDocument();
  });
});
