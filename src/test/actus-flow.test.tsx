import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Actus from "@/pages/Actus";

const jsonResponse = (payload: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: async () => payload,
  } as Response);

const memoryRouterFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe("Actus admin flow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the public /actus page free of admin controls", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = (init?.method || "GET").toUpperCase();

      if (url.endsWith("/api/news.php") && method === "GET") {
        return jsonResponse({ success: true, items: [] });
      }

      if (url.endsWith("/api/admin.php") && method === "GET") {
        return jsonResponse({ success: true, authenticated: false, username: "" });
      }

      return jsonResponse({ success: false, error: "Unhandled route" }, false, 500);
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Actus />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/Gestion des actus/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/@lehavretaxi/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Instagram et Facebook$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Actualités Radio Taxi Le Havre/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Se connecter/i })).not.toBeInTheDocument();
  });

  it("authenticates admin and publishes a new site news", async () => {
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
            id: "news-test",
            title: "Nouvelle actualité",
            image: "/images/actus-instagram-1.webp",
            sourceUrl: "https://www.taxis-lehavre.com/actus/nouvelle-actualite",
            sourceName: "Actualite",
          },
        });
      }

      return jsonResponse({ success: false, error: "Unhandled route" }, false, 500);
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Actus adminMode />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Identifiant administrateur/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/Mot de passe administrateur/i)).toHaveAttribute("required");

    const loginPassword = screen.getByLabelText(/Mot de passe administrateur/i);
    fireEvent.submit(loginPassword.closest("form")!);
    expect(loginPassword).toHaveAttribute("aria-invalid", "true");
    expect(loginPassword).toHaveAttribute("aria-describedby", "actus-admin-status");
    expect(document.activeElement).toBe(loginPassword);
    expect(screen.getByRole("alert")).toHaveTextContent(/Renseignez le mot de passe administrateur/i);

    fireEvent.change(screen.getByPlaceholderText(/Identifiant admin/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "change-this-password" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/Connexion admin active/i)).toBeInTheDocument();
    });

    const composerForm = screen.getByRole("button", { name: /Publier l'actualité/i }).closest("form");
    expect(composerForm).not.toBeNull();
    fireEvent.submit(composerForm!);

    const errorSummary = screen.getByRole("alert");
    expect(errorSummary).toHaveTextContent(/Corrigez les champs suivants/i);
    expect(document.activeElement).toBe(errorSummary);
    expect(screen.getByLabelText(/^Titre$/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/URL image/i)).toHaveAttribute("aria-describedby", "news-image-error");
    expect(fetchMock.mock.calls.some(([input, init]) =>
      String(input).endsWith("/api/news.php") && (init?.method || "GET").toUpperCase() === "POST",
    )).toBe(false);

    fireEvent.change(screen.getByLabelText(/Titre/i), { target: { value: "Nouvelle actualité" } });
    fireEvent.change(screen.getByLabelText(/URL image/i), { target: { value: "/images/actus-instagram-1.webp" } });
    fireEvent.change(screen.getByLabelText(/Lien de l'actualité/i), {
      target: { value: "https://www.taxis-lehavre.com/actus/nouvelle-actualite" },
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Publier l'actualité/i }));

    await waitFor(() => {
      expect(screen.getByText(/^Actualité publiée\.$/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/news.php",
      expect.objectContaining({ method: "POST", credentials: "same-origin" }),
    );
  }, 15000);

  it("keeps a valid news draft when the server rejects publication", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = (init?.method || "GET").toUpperCase();

      if (url.endsWith("/api/news.php") && method === "GET") {
        return jsonResponse({ success: true, items: [] });
      }

      if (url.endsWith("/api/admin.php") && method === "GET") {
        return jsonResponse({ success: true, authenticated: true, username: "admin" });
      }

      if (url.endsWith("/api/news.php") && method === "POST") {
        return jsonResponse({ success: false, error: "Reference invalide" }, false, 422);
      }

      return jsonResponse({ success: false, error: "Unhandled route" }, false, 500);
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Actus adminMode />
      </MemoryRouter>,
    );

    const title = await screen.findByLabelText(/^Titre$/i);
    const image = screen.getByLabelText(/URL image/i);
    const sourceUrl = screen.getByLabelText(/Lien de l'actualité/i);
    fireEvent.change(title, { target: { value: "Nouvelle actualité vérifiée" } });
    fireEvent.change(image, { target: { value: "/images/actus-instagram-1.webp" } });
    fireEvent.change(sourceUrl, { target: { value: "https://www.taxis-lehavre.com/actus/test" } });
    fireEvent.click(screen.getByRole("button", { name: /Publier l'actualité/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/L'image ou le lien ne peut pas être utilisé/i);
    });
    expect(title).toHaveValue("Nouvelle actualité vérifiée");
    expect(image).toHaveValue("/images/actus-instagram-1.webp");
    expect(sourceUrl).toHaveValue("https://www.taxis-lehavre.com/actus/test");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/news.php",
      expect.objectContaining({ method: "POST", credentials: "same-origin" }),
    );
  }, 15000);

  it("announces rejected credentials and keeps the login fields available for correction", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = (init?.method || "GET").toUpperCase();

      if (url.endsWith("/api/news.php") && method === "GET") {
        return jsonResponse({ success: true, items: [] });
      }

      if (url.endsWith("/api/admin.php") && method === "GET") {
        return jsonResponse({ success: true, authenticated: false, username: "" });
      }

      if (url.endsWith("/api/admin.php") && method === "POST") {
        return jsonResponse({ success: false, error: "Identifiants invalides" }, false, 401);
      }

      return jsonResponse({ success: false, error: "Unhandled route" }, false, 500);
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Actus adminMode />
      </MemoryRouter>,
    );

    const username = await screen.findByLabelText(/Identifiant administrateur/i);
    const password = screen.getByLabelText(/Mot de passe administrateur/i);
    fireEvent.change(username, { target: { value: "admin" } });
    fireEvent.change(password, { target: { value: "incorrect-password" } });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Identifiant ou mot de passe incorrect/i);
    });
    expect(username).toHaveValue("admin");
    expect(password).toHaveValue("incorrect-password");
    expect(username).toHaveAttribute("aria-describedby", "actus-admin-status");
    expect(password).toHaveAttribute("aria-describedby", "actus-admin-status");
  }, 15000);
});
