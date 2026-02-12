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

const distanceInKm = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
  const earthRadius = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const buildContactApiCandidates = (): string[] => {
  const candidates = new Set<string>([CONTACT_API_URL]);

  if (typeof window !== "undefined") {
    const segments = window.location.pathname.split("/").filter(Boolean);

    for (let i = segments.length; i >= 0; i -= 1) {
      const prefix = segments.slice(0, i).join("/");
      const candidate = `${prefix ? `/${prefix}` : ""}/api/contact.php`;
      candidates.add(candidate);
    }
  }

  return Array.from(candidates);
};

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [stationQuery, setStationQuery] = useState("");
  const [selectedStationId, setSelectedStationId] = useState<number | null>(stationsData[0]?.id ?? null);
  const [feedback, setFeedback] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const contactSEO = useMemo(
    () => ({
      title: "Contact",
      description:
        "Contactez Radio Taxi Le Havre par téléphone ou via le formulaire. Consultez aussi les 35 stations de l'agglomération.",
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

    const selectedStillVisible = filteredStations.some((station) => station.id === selectedStationId);
    if (!selectedStillVisible) {
      setSelectedStationId(filteredStations[0].id);
    }
  }, [filteredStations, selectedStationId]);

  const selectedStation = useMemo(
    () => filteredStations.find((station) => station.id === selectedStationId) ?? null,
    [filteredStations, selectedStationId],
  );

  const openDirections = (station: Station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openNearestStation = () => {
    const fallbackUrl = "https://www.google.com/maps/search/station+taxi+le+havre";

    if (!navigator.geolocation) {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = stationsData.reduce((best, station) => {
          const candidateDistance = distanceInKm(coords.latitude, coords.longitude, station.latitude, station.longitude);
          if (!best || candidateDistance < best.distanceKm) {
            return { station, distanceKm: candidateDistance };
          }
          return best;
        }, null as { station: Station; distanceKm: number } | null);

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
          description: "Google Maps a été ouvert sur les stations de taxi du Havre.",
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
      _subject: "Nouveau message - Taxi Le Havre",
      _template: "table",
      _captcha: "false",
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setFeedback({ type: "error", message: "Merci de renseigner tous les champs obligatoires." });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      setFeedback({ type: "error", message: "Merci de saisir une adresse email valide." });
      return;
    }

    if (payload.message.length < MIN_MESSAGE_LENGTH) {
      setFeedback({ type: "error", message: `Le message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères.` });
      return;
    }

    setLoading(true);
    setFeedback({ type: "idle", message: "" });

    const abortController = new AbortController();
    const timeout = window.setTimeout(() => abortController.abort(), 12000);

    try {
      const apiCandidates = buildContactApiCandidates();
      let result: {
        success?: boolean;
        recipient?: string;
        delivered?: boolean;
        provider?: string;
        error?: string;
      } = {};
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
          const parsed = (await attempt.json().catch(() => ({}))) as {
            success?: boolean;
            recipient?: string;
            delivered?: boolean;
            provider?: string;
            error?: string;
          };

          if (attempt.ok && parsed.success === true) {
            response = attempt;
            result = parsed;
            break;
          }

          if (parsed.success === false) {
            throw new Error(parsed.error || `Contact API request failed (${attempt.status})`);
          }

          if (attempt.status !== 404) {
            // Some hosting setups rewrite unknown paths to index.html (HTTP 200).
            // Keep trying candidates until we hit the real API endpoint.
            if (attempt.ok && parsed.success === undefined && !parsed.error) {
              lastError = `Contact API not found at ${apiUrl}`;
              continue;
            }

            throw new Error(parsed.error || `Contact API request failed (${attempt.status})`);
          }

          lastError = parsed.error || `Contact API not found at ${apiUrl}`;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Contact API request failed";
          lastError = message;
        }
      }

      if (!response || result.success !== true) {
        throw new Error(lastError || "Contact API request failed");
      }

      const deliveryMessage = result.delivered
        ? `Votre message a été transmis à ${result.recipient ?? CONTACT_EMAIL}.`
        : `Votre message a été enregistré. Il sera transmis à ${result.recipient ?? CONTACT_EMAIL} dès que possible.`;

      toast({
        title: "Message envoyé",
        description: `${deliveryMessage} (${result.provider ?? "mail"})`,
      });

      setFeedback({ type: "success", message: deliveryMessage });
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur réseau pendant l'envoi.";
      toast({
        title: "Envoi impossible",
        description: `Le message n'a pas pu être transmis automatiquement. ${errorMessage}`,
        variant: "destructive",
      });

      setFeedback({
        type: "error",
        message: `Envoi direct indisponible. Vérifiez la configuration de l'API contact puis réessayez.`,
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
              <h2 className="font-heading font-bold text-2xl mb-6">Nos coordonnées</h2>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Téléphone</p>
                    <a href={`tel:${CONTACT_PHONE_LINK}`} className="text-muted-foreground hover:text-primary transition">
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Email</p>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground hover:text-primary transition">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">35 stations</p>
                    <p className="text-muted-foreground">Recherche rapide par nom ou adresse, avec itinéraire direct</p>
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
                <h3 className="font-heading font-semibold mb-3">Trouver une station à proximité</h3>

                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={stationQuery}
                    onChange={(event) => setStationQuery(event.target.value)}
                    placeholder="Ex: gare, hôtel de ville, avenue Foch"
                    className="pl-9"
                  />
                </div>

                <StationsMap
                  stations={filteredStations.length > 0 ? filteredStations : stationsData}
                  selectedStationId={selectedStationId}
                  onSelect={(station) => setSelectedStationId(station.id)}
                />

                <div className="flex flex-col sm:flex-row gap-2 mt-4 mb-4">
                  <Button type="button" onClick={openNearestStation} disabled={isLocating} className="sm:flex-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    {isLocating ? "Recherche..." : "Trouver la plus proche"}
                  </Button>
                  <Button type="button" variant="outline" asChild className="sm:flex-1">
                    <a href="https://www.google.com/maps/search/station+taxi+le+havre" target="_blank" rel="noopener noreferrer">
                      Ouvrir Google Maps
                    </a>
                  </Button>
                </div>

                <div className="rounded-lg border bg-card">
                  <div className="flex items-center justify-between px-3 py-2 border-b text-sm">
                    <span className="font-medium">Stations ({filteredStations.length}/35)</span>
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
                      <p className="p-3 text-sm text-muted-foreground">Aucune station ne correspond à votre recherche.</p>
                    )}

                    {filteredStations.map((station) => (
                      <button
                        key={station.id}
                        type="button"
                        onClick={() => setSelectedStationId(station.id)}
                        className={`w-full text-left px-3 py-2 text-sm transition ${
                          station.id === selectedStationId ? "bg-accent" : "hover:bg-muted"
                        }`}
                      >
                        <p className="font-medium">{station.name}</p>
                        <p className="text-muted-foreground">{station.address}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5 mt-4">
                <h3 className="font-heading font-semibold mb-3">Application et réseaux</h3>
                <div className="grid sm:grid-cols-2 gap-2 mb-3">
                  <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    <Download className="inline h-4 w-4 mr-1" />
                    Apple App Store
                  </a>
                  <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    <Download className="inline h-4 w-4 mr-1" />
                    Google Play Store
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">Instagram: lehavretaxi</p>
                <p className="text-sm text-muted-foreground">Facebook: taxilehavre</p>
                <div className="flex gap-3 mt-2">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Voir Instagram
                  </a>
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Voir Facebook
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-2">Envoyez-nous un message</h2>
              <p className="text-sm text-muted-foreground mb-6">Vos messages sont transmis à {CONTACT_EMAIL}.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom *</Label>
                    <Input id="name" name="name" required maxLength={100} placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" maxLength={20} placeholder="Votre téléphone" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required maxLength={255} placeholder="votre@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input id="subject" name="subject" required maxLength={200} placeholder="Ex: réservation aéroport demain matin" />
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

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
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
