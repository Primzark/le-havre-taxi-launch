import { FormEvent, useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Download } from "lucide-react";
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
} from "@/config/site";
import { useSEO } from "@/hooks/use-seo";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useSEO({
    title: "Contact",
    description:
      "Contactez Taxi Le Havre par téléphone ou formulaire. 35 stations sur l'agglomération havraise, service 24h/24.",
    canonicalPath: "/contact",
    robots: "noindex, follow",
  });

  const openNearestStation = () => {
    const fallbackUrl = "https://www.google.com/maps/search/station+taxi+le+havre";

    if (!navigator.geolocation) {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const mapsUrl = `https://www.google.com/maps/search/station+taxi/@${coords.latitude},${coords.longitude},14z`;
        window.open(mapsUrl, "_blank", "noopener,noreferrer");
        setIsLocating(false);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("website") || "").trim()) {
      return;
    }

    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
      _subject: "Nouveau message - Taxi Le Havre",
      _template: "table",
      _captcha: "false",
    };

    setLoading(true);

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({} as { success?: boolean; recipient?: string; delivered?: boolean }));
      if (!response.ok || result?.success !== true) {
        throw new Error("Contact API request failed");
      }

      toast({
        title: "Message envoyé",
        description: result.delivered
          ? `Votre message a été transmis à ${result.recipient ?? CONTACT_EMAIL}.`
          : `Votre message a été enregistré. Envoi mail en file d'attente vers ${result.recipient ?? CONTACT_EMAIL}.`,
      });
      setLoading(false);
      form.reset();
    } catch {
      const mailtoSubject = encodeURIComponent(`Nouveau message - ${payload.subject}`);
      const mailtoBody = encodeURIComponent(
        `Nom: ${payload.name}\nTéléphone: ${payload.phone}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`,
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

      toast({
        title: "Ouverture de votre messagerie",
        description: `L'envoi direct a échoué. Votre client mail a été ouvert vers ${CONTACT_EMAIL}.`,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHero title="Nous contacter" subtitle="Une question ? Contactez-nous par téléphone ou via le formulaire ci-dessous." />

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6">Nos coordonnées</h2>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Téléphone</p>
                    <a href={`tel:${CONTACT_PHONE_LINK}`} className="text-muted-foreground hover:text-primary transition">{CONTACT_PHONE_DISPLAY}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Email</p>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground hover:text-primary transition">{CONTACT_EMAIL}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">35 stations</p>
                    <p className="text-muted-foreground">Réparties dans l'agglomération havraise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-heading font-semibold">Disponibilité</p>
                    <p className="text-muted-foreground">24h/24 — 7j/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-heading font-semibold mb-3">Trouver une station à proximité</h3>
                <div className="rounded-lg overflow-hidden border mb-4">
                  <iframe
                    title="Stations de taxi au Havre"
                    src="https://www.google.com/maps?q=stations+taxi+le+havre&output=embed"
                    className="w-full h-72"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" onClick={openNearestStation} disabled={isLocating} className="sm:flex-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    {isLocating ? "Recherche..." : "Trouver une station proche"}
                  </Button>
                  <Button type="button" variant="outline" asChild className="sm:flex-1">
                    <a href="https://www.google.com/maps/search/station+taxi+le+havre" target="_blank" rel="noopener noreferrer">
                      Ouvrir Google Maps
                    </a>
                  </Button>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5 mt-4">
                <h3 className="font-heading font-semibold mb-3">Application & réseaux</h3>
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
                    Ouvrir Instagram
                  </a>
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Ouvrir Facebook
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot */}
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
                  <Input id="subject" name="subject" required maxLength={200} placeholder="Objet de votre message" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" required maxLength={2000} rows={5} placeholder="Votre message..." />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
