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
  it("keeps the primary booking call action visible and identifiable", () => {
    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    const callLink = screen.getByRole("link", { name: /Appeler ·/i });

    expect(callLink).toHaveAttribute("href", expect.stringMatching(/^tel:/));
    expect(callLink).toHaveAttribute("data-analytics-id", "contact-primary-call-button");
    expect(callLink).toHaveAttribute("data-analytics-location", "contact_primary");
    expect(callLink).toHaveAttribute("data-analytics-intent", "booking");
  });

  it("prefills the subject from the contact URL", () => {
    render(
      <MemoryRouter
        initialEntries={["/contact?subject=R%C3%A9servation%20circuit%20N%C2%B02%20-%20%C3%89tretat"]}
        future={memoryRouterFutureConfig}
      >
        <Contact />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/Sujet \*/i)).toHaveValue("Réservation circuit N°2 - Étretat");
  });

  it("shows structured email feedback after blur and clears it when corrected", () => {
    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    const email = screen.getByLabelText(/Email \*/i);
    fireEvent.change(email, { target: { value: "adresse-invalide" } });
    expect(email).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(/Vérifiez le format de votre adresse e-mail/i)).not.toBeInTheDocument();

    fireEvent.blur(email);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getAllByText(/Vérifiez le format de votre adresse e-mail/i)).toHaveLength(2);

    fireEvent.change(email, { target: { value: "qa@example.com" } });
    expect(email).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(/Vérifiez le format de votre adresse e-mail/i)).not.toBeInTheDocument();
  });

  it("summarizes and focuses all errors on submit without calling the API", () => {
    const fetchMock = vi.spyOn(global, "fetch");
    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    const form = screen.getByLabelText(/Nom \*/i).closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    const summary = screen.getByRole("alert");
    expect(summary).toHaveTextContent("Corrigez les points suivants avant l'envoi");
    expect(document.activeElement).toBe(summary);
    expect(screen.getByLabelText(/Nom \*/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Email \*/i)).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByLabelText(/Sujet \*/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Message \*/i)).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();

    fetchMock.mockRestore();
  });

  it("submits the contact form and shows success feedback", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, recipient: "bureautaxi@gmail.com", delivered: true, provider: "mail" }),
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

  it("blocks repeated submissions while pending and preserves values after a server rejection", async () => {
    let finishRequest: ((response: Response) => void) | undefined;
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(
      () => new Promise<Response>((resolve) => { finishRequest = resolve; }),
    );

    render(
      <MemoryRouter future={memoryRouterFutureConfig}>
        <Contact />
      </MemoryRouter>,
    );

    const name = screen.getByLabelText(/Nom \*/i);
    const phone = screen.getByLabelText(/Téléphone/i);
    const email = screen.getByLabelText(/Email \*/i);
    const subject = screen.getByLabelText(/Sujet \*/i);
    const message = screen.getByLabelText(/Message \*/i);
    fireEvent.change(name, { target: { value: "QA Tester" } });
    fireEvent.change(phone, { target: { value: "0123456789" } });
    fireEvent.change(email, { target: { value: "qa@example.com" } });
    fireEvent.change(subject, { target: { value: "Demande de test" } });
    fireEvent.change(message, { target: { value: "Message de test assez long pour être envoyé." } });

    const form = name.closest("form");
    fireEvent.submit(form!);
    expect(form).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: /Envoi en cours/i })).toBeDisabled();
    fireEvent.submit(form!);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    finishRequest?.({
      ok: false,
      status: 422,
      json: async () => ({ success: false, error: "Adresse e-mail invalide" }),
    } as Response);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Votre message n'a pas pu être envoyé/i);
    });
    expect(name).toHaveValue("QA Tester");
    expect(email).toHaveValue("qa@example.com");
    expect(subject).toHaveValue("Demande de test");
    expect(message).toHaveValue("Message de test assez long pour être envoyé.");

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
          json: async () => ({ success: true, recipient: "bureautaxi@gmail.com", delivered: true, provider: "mail" }),
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

  it("falls back to FormSubmit when the contact API is available but delivery fails", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url === CONTACT_API_URL) {
        return {
          ok: false,
          status: 503,
          json: async () => ({ success: false, error: "Échec de la requête Resend : HTTP 403" }),
        } as unknown as Response;
      }

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

    fireEvent.change(screen.getByLabelText(/Nom \*/i), { target: { value: "QA Provider Fallback" } });
    fireEvent.change(screen.getByLabelText(/Téléphone/i), { target: { value: "0123456789" } });
    fireEvent.change(screen.getByLabelText(/Email \*/i), { target: { value: "qa-provider-fallback@example.com" } });
    fireEvent.change(screen.getByLabelText(/Sujet \*/i), { target: { value: "Fallback provider error" } });
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: "Ce message vérifie le fallback quand l'API principale est joignable mais que l'envoi échoue côté fournisseur." },
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

    fetchMock.mockRestore();
  }, 15000);

  it("keeps trying local API candidates after an unrelated 405 response", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url === "/api/contact.php") {
        return {
          ok: false,
          status: 405,
          json: async () => {
            throw new Error("Non-JSON response");
          },
        } as unknown as Response;
      }

      if (url === "/TaxiWebsite/le-havre-taxi-launch/api/contact.php") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, recipient: "bureautaxi@gmail.com", delivered: true, provider: "mail" }),
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

    fireEvent.change(screen.getByLabelText(/Nom \*/i), { target: { value: "QA Retry" } });
    fireEvent.change(screen.getByLabelText(/Téléphone/i), { target: { value: "0123456789" } });
    fireEvent.change(screen.getByLabelText(/Email \*/i), { target: { value: "qa-retry@example.com" } });
    fireEvent.change(screen.getByLabelText(/Sujet \*/i), { target: { value: "Retry after 405" } });
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: "Ce message vérifie le passage au candidat suivant après une réponse 405 non pertinente." },
    });

    fireEvent.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/contact.php",
        expect.objectContaining({ method: "POST" }),
      );
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/TaxiWebsite/le-havre-taxi-launch/api/contact.php",
        expect.objectContaining({ method: "POST" }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(`Message envoyé à ${CONTACT_EMAIL}.`)).toBeInTheDocument();
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
      expect(screen.getByRole("alert")).toHaveTextContent(/L'envoi automatique n'a pas abouti/i);
    });

    fetchMock.mockRestore();
  }, 15000);
});
