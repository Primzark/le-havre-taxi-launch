import { FormEvent, useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import StationsMap from "@/components/StationsMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  CONTACT_API_URL,
  APPLE_STORE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PLAY_STORE_URL,
  PRIMARY_DOMAIN,
  SITE_NAME,
} from "@/config/site";
import { useSEO } from "@/hooks/use-seo";
import { Station, stationsData } from "@/data/stations";

const MIN_MESSAGE_LENGTH = 10;

const toRadians = (value: number) => (value * Math.PI) / 180;

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  _subject: string;
  _template: string;
  _captcha: string;
};

type ContactApiResult = {
  success?: boolean;
  recipient?: string;
  delivered?: boolean;
  provider?: string;
  error?: string;
};

const distanceInKm = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
) => {
  const earthRadius = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const buildContactApiCandidates = (): string[] => {
  const candidates: string[] = [];
  const seen = new Set<string>();

  const toApiPath = (root: string) => {
    const normalizedRoot = root.trim().replace(/\/+$/, "");
    return `${normalizedRoot}/api/contact.php`.replace(/\/{2,}/g, "/");
  };

  const addCandidate = (value: string) => {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    candidates.push(normalized);
  };

  addCandidate(CONTACT_API_URL);

  const envCandidate = String(
    import.meta.env.VITE_CONTACT_API_URL ?? "",
  ).trim();
  if (envCandidate) {
    addCandidate(envCandidate);
  }

  const baseUrl = String(import.meta.env.BASE_URL ?? "/");
  const normalizedBase = (
    baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`
  ).replace(/\/+$/, "");
  addCandidate(toApiPath(normalizedBase || "/"));

  // Common local deployment paths (MAMP/XAMPP style).
  addCandidate("/TaxiWebsite/le-havre-taxi-launch/api/contact.php");
  addCandidate("/le-havre-taxi-launch/api/contact.php");
  addCandidate("/TaxiWebsite/api/contact.php");

  if (typeof window !== "undefined") {
    addCandidate(`${window.location.origin}/api/contact.php`);
    addCandidate(
      `${window.location.origin}/TaxiWebsite/le-havre-taxi-launch/api/contact.php`,
    );
    addCandidate(
      `${window.location.origin}/le-havre-taxi-launch/api/contact.php`,
    );
    addCandidate(`${window.location.origin}/TaxiWebsite/api/contact.php`);

    const segments = window.location.pathname.split("/").filter(Boolean);

    // Try project roots only, not the current page route itself.
    // Example: /TaxiWebsite/le-havre-taxi-launch/contact -> try:
    // /api/contact.php, /TaxiWebsite/api/contact.php, /TaxiWebsite/le-havre-taxi-launch/api/contact.php
    for (let i = 0; i < segments.length; i += 1) {
      const prefix = segments.slice(0, i).join("/");
      addCandidate(toApiPath(prefix ? `/${prefix}` : "/"));
    }

    const projectToken = "le-havre-taxi-launch";
    const projectTokenIndex = segments.indexOf(projectToken);
    if (projectTokenIndex >= 0) {
      const projectRoot = `/${segments.slice(0, projectTokenIndex + 1).join("/")}`;
      addCandidate(toApiPath(projectRoot));
      addCandidate(`${window.location.origin}${toApiPath(projectRoot)}`);
    }

    try {
      const modulePath = new URL(import.meta.url).pathname;
      const assetsIndex = modulePath.indexOf("/assets/");
      if (assetsIndex > 0) {
        const bundleRoot = modulePath.slice(0, assetsIndex);
        addCandidate(toApiPath(bundleRoot));
        addCandidate(`${window.location.origin}${toApiPath(bundleRoot)}`);
      }
    } catch {
      // Ignore import.meta.url parsing failures.
    }

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      addCandidate(
        "http://localhost:8888/TaxiWebsite/le-havre-taxi-launch/api/contact.php",
      );
      addCandidate(
        "http://127.0.0.1:8888/TaxiWebsite/le-havre-taxi-launch/api/contact.php",
      );
      addCandidate(
        "http://localhost:8888/le-havre-taxi-launch/api/contact.php",
      );
      addCandidate(
        "http://127.0.0.1:8888/le-havre-taxi-launch/api/contact.php",
      );
      addCandidate("http://localhost:8888/api/contact.php");
      addCandidate("http://127.0.0.1:8888/api/contact.php");
      addCandidate("http://localhost:8090/api/contact.php");
      addCandidate("http://127.0.0.1:8090/api/contact.php");
    }
  }

  return candidates;
};

const isRecognizableContactApiResponse = (value: ContactApiResult) =>
  typeof value.success === "boolean" ||
  typeof value.error === "string" ||
  typeof value.recipient === "string" ||
  typeof value.provider === "string";

const isRetriableContactApiCandidateFailure = (
  status: number,
  value: ContactApiResult,
) => {
  if (status === 404) {
    return true;
  }

  if (!isRecognizableContactApiResponse(value)) {
    return true;
  }

  return (
    status === 405 &&
    /méthode non autorisée|method not allowed/i.test(String(value.error ?? ""))
  );
};

const sendViaFormSubmitFallback = async (
  payload: ContactPayload,
  signal: AbortSignal,
) => {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        Nom: payload.name,
        Téléphone: payload.phone || "Non renseigné",
        Email: payload.email,
        Sujet: payload.subject,
        Message: payload.message,
        _subject: payload._subject,
        _template: payload._template,
        _captcha: payload._captcha,
        _replyto: payload.email,
      }),
      signal,
    },
  );

  const result = (await response.json().catch(() => ({}))) as {
    success?: boolean | string;
    message?: string;
    error?: string;
  };

  const isSuccess =
    response.ok &&
    (result.success === true ||
      String(result.success).toLowerCase() === "true");

  if (!isSuccess) {
    throw new Error(
      result.message ||
        result.error ||
        `Fallback delivery failed (${response.status})`,
    );
  }

  return result;
};

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [stationQuery, setStationQuery] = useState("");
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    stationsData[0]?.id ?? null,
  );
  const [feedback, setFeedback] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const contactSEO = useMemo(
    () => ({
      title: "Contact",
      description: `Contactez Radio Taxi Le Havre par téléphone ou via le formulaire. Consultez aussi les ${stationsData.length} stations de l'agglomération.`,
      canonicalPath: "/contact",
      ogImage: "/images/home-mairie.webp",
      keywords: [
        "contact taxi le havre",
        "numéro taxi le havre",
        "station taxi le havre",
        "formulaire taxi le havre",
      ],
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: `Contact ${SITE_NAME}`,
        url: `${PRIMARY_DOMAIN}/contact`,
        inLanguage: "fr-FR",
        mainEntity: {
          "@type": "LocalBusiness",
          name: SITE_NAME,
          url: PRIMARY_DOMAIN,
          email: CONTACT_EMAIL,
          telephone: CONTACT_PHONE_LINK,
        },
      },
    }),
    [],
  );

  useSEO(contactSEO);

  const filteredStations = useMemo(() => {
    const needle = stationQuery.trim().toLowerCase();
    if (!needle) {
      return stationsData;
    }

    return stationsData.filter((station) => {
      const indexText = `${station.name} ${station.address}`.toLowerCase();
      return indexText.includes(needle);
    });
  }, [stationQuery]);

  useEffect(() => {
    if (filteredStations.length === 0) {
      return;
    }

    const selectedStillVisible = filteredStations.some(
      (station) => station.id === selectedStationId,
    );
    if (!selectedStillVisible) {
      setSelectedStationId(filteredStations[0].id);
    }
  }, [filteredStations, selectedStationId]);

  const selectedStation = useMemo(
    () =>
      filteredStations.find((station) => station.id === selectedStationId) ??
      null,
    [filteredStations, selectedStationId],
  );

  const openDirections = (station: Station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openNearestStation = () => {
    const fallbackUrl =
      "https://www.google.com/maps/search/station+taxi+le+havre";

    if (!navigator.geolocation) {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = stationsData.reduce(
          (best, station) => {
            const candidateDistance = distanceInKm(
              coords.latitude,
              coords.longitude,
              station.latitude,
              station.longitude,
            );
            if (!best || candidateDistance < best.distanceKm) {
              return { station, distanceKm: candidateDistance };
            }
            return best;
          },
          null as { station: Station; distanceKm: number } | null,
        );

        if (!nearest) {
          window.open(fallbackUrl, "_blank", "noopener,noreferrer");
          setIsLocating(false);
          return;
        }

        setSelectedStationId(nearest.station.id);
        openDirections(nearest.station);
        setIsLocating(false);

        toast({
          title: "Station la plus proche trouvée",
          description: `${nearest.station.name} à environ ${nearest.distanceKm.toFixed(1)} km.`,
        });
      },
      () => {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
        setIsLocating(false);
        toast({
          title: "Position non disponible",
          description:
            "Google Maps a été ouvert sur les stations de taxi du Havre.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("website") || "").trim()) {
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      _subject: "Nouveau message du formulaire - Taxi Le Havre",
      _template: "table",
      _captcha: "false",
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      setFeedback({
        type: "error",
        message: "Merci de renseigner tous les champs obligatoires.",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      setFeedback({
        type: "error",
        message: "Merci de saisir une adresse email valide.",
      });
      return;
    }

    if (payload.message.length < MIN_MESSAGE_LENGTH) {
      setFeedback({
        type: "error",
        message: `Le message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères.`,
      });
      return;
    }

    setLoading(true);
    setFeedback({ type: "idle", message: "" });

    const abortController = new AbortController();
    const timeout = window.setTimeout(() => abortController.abort(), 12000);

    try {
      const apiCandidates = buildContactApiCandidates();
      let result: ContactApiResult = {};
      let response: Response | null = null;
      let lastError: string | null = null;

      for (const apiUrl of apiCandidates) {
        try {
          const attempt = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
            signal: abortController.signal,
          });
          const parsed = (await attempt.json().catch(
            () => ({}),
          )) as ContactApiResult;

          if (attempt.ok && parsed.success === true) {
            response = attempt;
            result = parsed;
            break;
          }

          if (isRetriableContactApiCandidateFailure(attempt.status, parsed)) {
            lastError =
              parsed.error || `Contact API not found at ${apiUrl}`;
            continue;
          }

          throw new Error(
            parsed.error || `Contact API request failed (${attempt.status})`,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Contact API request failed";
          lastError = message;
        }
      }

      if (!response || result.success !== true) {
        throw new Error(lastError || "Contact API request failed");
      }

      const deliveryMessage = `Message envoyé à ${CONTACT_EMAIL}.`;

      toast({
        title: "Message envoyé",
        description: deliveryMessage,
      });

      setFeedback({ type: "success", message: deliveryMessage });
      form.reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur réseau pendant l'envoi.";
      const normalizedMessage = errorMessage.trim();
      const displayErrorMessage =
        /failed to fetch|network/i.test(normalizedMessage)
          ? "Erreur réseau pendant l'envoi."
          : /not found/i.test(normalizedMessage)
            ? "API de contact introuvable."
            : /cors/i.test(normalizedMessage)
              ? "Accès bloqué par la politique de sécurité du navigateur."
              : normalizedMessage;
      const isRateLimited = /too many requests|retry later|429/i.test(
        normalizedMessage,
      );
      const isPathIssue = /not found|introuvable/i.test(normalizedMessage);
      const isDeliveryProviderIssue = /request failed \(503\)|échec de la requête resend|mail_from_email|resend|échec de l'envoi de l'e-mail/i.test(
        normalizedMessage.toLowerCase(),
      );
      const shouldTryFallback =
        /not found|failed to fetch|network|cors|request failed \(404\)|endpoint api introuvable|api de contact introuvable|introuvable|réseau/i.test(
          normalizedMessage.toLowerCase(),
        ) || isDeliveryProviderIssue;

      if (shouldTryFallback) {
        try {
          await sendViaFormSubmitFallback(payload, abortController.signal);

          const fallbackMessage = `Message envoyé à ${CONTACT_EMAIL}.`;
          toast({
            title: "Message envoyé",
            description: fallbackMessage,
          });
          setFeedback({ type: "success", message: fallbackMessage });
          form.reset();
          return;
        } catch (fallbackError) {
          const fallbackText =
            fallbackError instanceof Error
              ? fallbackError.message
              : "Fallback delivery failed";
          const needsActivation =
            /activation|activate form|needs activation/i.test(fallbackText);
          const fallbackFeedback = needsActivation
            ? `La passerelle d'envoi nécessite une activation unique. Ouvrez la boîte ${CONTACT_EMAIL}, cliquez sur "Activate Form", puis réessayez.`
            : `Envoi direct indisponible. ${fallbackText}`;

          toast({
            title: "Envoi impossible",
            description: needsActivation
              ? `Activation requise sur ${CONTACT_EMAIL}. Vérifiez votre boîte mail et cliquez sur le lien "Activate Form".`
              : `L'API principale et la passerelle de secours ont échoué. ${fallbackText}`,
            variant: "destructive",
          });
          setFeedback({
            type: "error",
            message: fallbackFeedback,
          });
          return;
        }
      }

      const feedbackMessage = isRateLimited
        ? "Trop de tentatives en peu de temps. Réessayez dans quelques instants."
        : isPathIssue
          ? "Envoi direct indisponible. API de contact introuvable."
          : `Envoi direct indisponible. ${displayErrorMessage}`;

      toast({
        title: "Envoi impossible",
        description: `Le message n'a pas pu être transmis automatiquement. ${displayErrorMessage}`,
        variant: "destructive",
      });

      setFeedback({
        type: "error",
        message: feedbackMessage,
      });
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHero
        title="Nous contacter"
        subtitle="Un renseignement, une réservation ou un besoin précis ? Nous vous répondons rapidement."
        backgroundImage="/images/home-mairie.webp"
      />

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6">
                Nos coordonnées
              </h2>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Téléphone</p>
                    <a
                      href={`tel:${CONTACT_PHONE_LINK}`}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Email</p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">
                      {stationsData.length} stations
                    </p>
                    <p className="text-muted-foreground">
                      Recherche rapide par nom ou adresse, avec itinéraire
                      direct
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Disponibilité</p>
                    <p className="text-muted-foreground">24h/24 - 7j/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-heading font-semibold mb-3">
                  Trouver une station à proximité
                </h3>

                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={stationQuery}
                    onChange={(event) => setStationQuery(event.target.value)}
                    placeholder="Ex. : gare, hôtel de ville, avenue Foch"
                    className="pl-9"
                  />
                </div>

                <StationsMap
                  stations={
                    filteredStations.length > 0
                      ? filteredStations
                      : stationsData
                  }
                  selectedStationId={selectedStationId}
                  onSelect={(station) => setSelectedStationId(station.id)}
                />

                <div className="flex flex-col sm:flex-row gap-2 mt-4 mb-4">
                  <Button
                    type="button"
                    onClick={openNearestStation}
                    disabled={isLocating}
                    className="sm:flex-1"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {isLocating ? "Recherche..." : "Trouver la plus proche"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="sm:flex-1"
                  >
                    <a
                      href="https://www.google.com/maps/search/station+taxi+le+havre"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ouvrir Google Maps
                    </a>
                  </Button>
                </div>

                <div className="rounded-lg border bg-card">
                  <div className="flex items-center justify-between px-3 py-2 border-b text-sm">
                    <span className="font-medium">
                      Stations ({filteredStations.length}/{stationsData.length})
                    </span>
                    {selectedStation && (
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => openDirections(selectedStation)}
                      >
                        Ouvrir l'itinéraire vers {selectedStation.name}
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-auto divide-y">
                    {filteredStations.length === 0 && (
                      <p className="p-3 text-sm text-muted-foreground">
                        Aucune station ne correspond à votre recherche.
                      </p>
                    )}

                    {filteredStations.map((station) => (
                      <button
                        key={station.id}
                        type="button"
                        onClick={() => setSelectedStationId(station.id)}
                        className={`w-full text-left px-3 py-2 text-sm transition ${
                          station.id === selectedStationId
                            ? "bg-accent"
                            : "hover:bg-muted"
                        }`}
                      >
                        <p className="font-medium">{station.name}</p>
                        <p className="text-muted-foreground">
                          {station.address}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5 mt-4">
                <h3 className="font-heading font-semibold mb-3">
                  Application et réseaux
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 mb-3">
                  <a
                    href={APPLE_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    <Download className="inline h-4 w-4 mr-1" />
                    Apple App Store
                  </a>
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    <Download className="inline h-4 w-4 mr-1" />
                    Google Play Store
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Instagram : lehavretaxi
                </p>
                <p className="text-sm text-muted-foreground">
                  Facebook : TaxiLeHavre
                </p>
                <div className="flex gap-3 mt-2">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir Instagram
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir Facebook
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Vos messages sont transmis à {CONTACT_EMAIL}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="website"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      maxLength={100}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      maxLength={20}
                      placeholder="Votre téléphone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    maxLength={200}
                    placeholder="Ex. : réservation aéroport demain matin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    maxLength={2000}
                    rows={5}
                    minLength={MIN_MESSAGE_LENGTH}
                    placeholder="Indiquez votre demande, la date et toute précision utile."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </Button>

                {feedback.message && (
                  <p
                    className={`text-sm ${feedback.type === "error" ? "text-destructive" : "text-primary"}`}
                    role="status"
                    aria-live="polite"
                  >
                    {feedback.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
