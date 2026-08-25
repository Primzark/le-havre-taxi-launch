import { afterEach, describe, expect, it } from "vitest";
import { fireEvent } from "@testing-library/react";
import { initAnalytics } from "@/lib/analytics";

describe("delegated journey click tracking", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("tracks phone intent metadata from a tel link", () => {
    window.dataLayer = [];
    window.__taxiAnalyticsInitialized = true;
    window.__taxiAnalyticsClickListener = false;

    document.body.innerHTML = `
      <a
        href="tel:+33235190009"
        data-analytics-id="tour-detail-call"
        data-analytics-location="tour-detail-actions"
        data-analytics-intent="booking"
      >
        <span>Appeler pour réserver</span>
      </a>
    `;

    document.querySelector("a")!.addEventListener("click", (event) => event.preventDefault());
    initAnalytics();
    fireEvent.click(document.querySelector("span")!);

    const phoneClick = window.dataLayer.find(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        "event" in entry &&
        entry.event === "phone_click",
    );

    expect(phoneClick).toMatchObject({
      event: "phone_click",
      link_id: "tour-detail-call",
      link_location: "tour-detail-actions",
      intent: "booking",
    });
  });
});
