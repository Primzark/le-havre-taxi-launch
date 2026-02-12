import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Actus from "@/pages/Actus";

const jsonResponse = (payload: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: async () => payload,
  } as Response);

describe("Actus admin flow", () => {
  it("authenticates admin and publishes a new capture", async () => {
    let authenticated = false;

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = (init?.method || "GET").toUpperCase();

      if (url.endsWith("/api/news.php") && method === "GET") {
        return jsonResponse({ success: true, items: [] });
      }

      if (url.endsWith("/api/admin.php") && method === "GET") {
        return jsonResponse({ success: true, authenticated, username: authenticated ? "admin" : "" });
      }

      if (url.endsWith("/api/admin.php") && method === "POST") {
        authenticated = true;
        return jsonResponse({ success: true, authenticated: true, username: "admin" });
      }

      if (url.endsWith("/api/news.php") && method === "POST") {
        return jsonResponse({
          success: true,
          item: {
            id: "manual-test",
            title: "Nouvelle capture",
            image: "/images/actus-instagram-1.jpg",
            sourceUrl: "https://www.instagram.com/lehavretaxi",
            sourceName: "Instagram",
          },
        });
      }

      return jsonResponse({ success: false, error: "Unhandled route" }, false, 500);
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    render(
      <MemoryRouter>
        <Actus />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Identifiant admin/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "change-this-password" } });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/Connexion admin active/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Titre/i), { target: { value: "Nouvelle capture" } });
    fireEvent.change(screen.getByLabelText(/URL image/i), { target: { value: "/images/actus-instagram-1.jpg" } });
    fireEvent.change(screen.getByLabelText(/Lien source/i), {
      target: { value: "https://www.instagram.com/lehavretaxi" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Ajouter la capture/i }));

    await waitFor(() => {
      expect(screen.getByText(/Capture publiée/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/news.php",
      expect.objectContaining({ method: "POST", credentials: "same-origin" }),
    );

    vi.unstubAllGlobals();
  });
});
