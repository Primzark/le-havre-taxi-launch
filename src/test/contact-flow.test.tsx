import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "@/pages/Contact";
import { CONTACT_API_URL, CONTACT_EMAIL } from "@/config/site";

vi.mock("@/components/StationsMap", () => ({
  default: () => <div data-testid="stations-map">Map mock</div>,
}));

const memoryRouterFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe("Contact page", () => {
  it("submits the contact form and shows success feedback", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, recipient: "contactradiotaxilehavre@gmail.com", delivered: true, provider: "mail" }),
    } as unknown as Response);

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Nom \*/i), { target: { value: "QA Tester" } });
    fireEvent.change(screen.getByLabelText(/Téléphone/i), { target: { value: "0123456789" } });
    fireEvent.change(screen.getByLabelText(/Email \*/i), { target: { value: "qa@example.com" } });
    fireEvent.change(screen.getByLabelText(/Sujet \*/i), { target: { value: "Demande de test" } });
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: "Ceci est un message de test suffisamment long." },
    });

    fireEvent.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        CONTACT_API_URL,
        expect.objectContaining({ method: "POST", headers: expect.any(Object), body: expect.any(String) }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(`Message envoyé à ${CONTACT_EMAIL}.`)).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  }, 15000);

  it("resolves contact API when hosted in a subdirectory", async () => {
    window.history.pushState({}, "", "/TaxiWebsite/le-havre-taxi-launch/contact");

    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url === "/TaxiWebsite/le-havre-taxi-launch/api/contact.php") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, recipient: "starlod7696@gmail.com", delivered: true, provider: "mail" }),
        } as unknown as Response;
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: "Not found" }),
      } as unknown as Response;
    });

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Nom \*/i), { target: { value: "QA Subdir" } });
    fireEvent.change(screen.getByLabelText(/Téléphone/i), { target: { value: "0123456789" } });
    fireEvent.change(screen.getByLabelText(/Email \*/i), { target: { value: "qa-subdir@example.com" } });
    fireEvent.change(screen.getByLabelText(/Sujet \*/i), { target: { value: "Test sous-dossier" } });
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: "Ceci est un message de test suffisamment long en mode sous-dossier." },
    });

    fireEvent.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/TaxiWebsite/le-havre-taxi-launch/api/contact.php",
        expect.objectContaining({ method: "POST", headers: expect.any(Object), body: expect.any(String) }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(`Message envoyé à ${CONTACT_EMAIL}.`)).toBeInTheDocument();
    });

    fetchMock.mockRestore();
    window.history.pushState({}, "", "/");
  }, 15000);

  it("falls back to FormSubmit when API endpoint is missing", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.startsWith(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`)) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: "true" }),
        } as unknown as Response;
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: `Contact API not found at ${url}` }),
      } as unknown as Response;
    });

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Nom \*/i), { target: { value: "QA Fallback" } });
    fireEvent.change(screen.getByLabelText(/Téléphone/i), { target: { value: "0123456789" } });
    fireEvent.change(screen.getByLabelText(/Email \*/i), { target: { value: "qa-fallback@example.com" } });
    fireEvent.change(screen.getByLabelText(/Sujet \*/i), { target: { value: "Test fallback" } });
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: "Ceci est un message de test suffisamment long pour déclencher la passerelle de secours." },
    });

    fireEvent.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`),
        expect.objectContaining({ method: "POST" }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(`Message envoyé à ${CONTACT_EMAIL}.`)).toBeInTheDocument();
    });

    const fallbackCall = fetchMock.mock.calls.find(([url]) =>
      String(url).startsWith(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`),
    );
    const fallbackOptions = fallbackCall?.[1] as RequestInit | undefined;
    const fallbackBody = fallbackOptions?.body ? JSON.parse(String(fallbackOptions.body)) : {};

    await waitFor(() => {
      expect(fallbackBody).toMatchObject({
        Nom: "QA Fallback",
        "Téléphone": "0123456789",
        Email: "qa-fallback@example.com",
        Sujet: "Test fallback",
        _subject: "Nouveau message du formulaire - Taxi Le Havre",
      });
    });

    fetchMock.mockRestore();
  }, 15000);

  it("shows clear activation guidance when FormSubmit is not yet activated", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.startsWith(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`)) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: "false", message: "This form needs Activation." }),
        } as unknown as Response;
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: `Contact API not found at ${url}` }),
      } as unknown as Response;
    });

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Nom \*/i), { target: { value: "QA Activation" } });
    fireEvent.change(screen.getByLabelText(/Téléphone/i), { target: { value: "0123456789" } });
    fireEvent.change(screen.getByLabelText(/Email \*/i), { target: { value: "qa-activation@example.com" } });
    fireEvent.change(screen.getByLabelText(/Sujet \*/i), { target: { value: "Activation fallback" } });
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: "Ce message vérifie le cas d'activation obligatoire de la passerelle de secours." },
    });

    fireEvent.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(screen.getByText(/passerelle d'envoi nécessite une activation unique/i)).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  }, 15000);
});
