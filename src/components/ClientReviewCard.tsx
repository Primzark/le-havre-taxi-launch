import { ExternalLink, Flag, Star } from "lucide-react";
import { ClientReview } from "@/data/reviews";
import { cn } from "@/lib/utils";

type ClientReviewCardProps = {
  review: ClientReview;
  compact?: boolean;
  className?: string;
};

const MAX_STARS = 5;

const ClientReviewCard = ({ review, compact = false, className }: ClientReviewCardProps) => (
  <article
    className={cn(
      "rounded-xl border bg-card shadow-sm",
      compact ? "p-5" : "p-6",
      className,
    )}
  >
    <div className="flex items-center gap-4">
      <img
        src={review.avatar}
        alt={review.author}
        className={cn("rounded-full border object-cover", compact ? "h-14 w-14" : "h-16 w-16")}
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{review.source}</p>
        {review.authorUrl ? (
          <a
            href={review.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 font-semibold text-foreground transition hover:text-primary"
          >
            <span className="truncate">{review.author}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="mt-1 font-semibold text-foreground">{review.author}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="inline-flex items-center gap-1 text-amber-500">
            {Array.from({ length: MAX_STARS }).map((_, index) => (
              <Star
                key={index}
                className={cn("h-4 w-4", index < review.rating ? "fill-current" : "text-muted-foreground/35")}
              />
            ))}
          </div>
          {review.publishedAtLabel && (
            <p className="text-xs text-muted-foreground">{review.publishedAtLabel}</p>
          )}
        </div>
      </div>
    </div>

    <p className={cn("leading-relaxed text-muted-foreground", compact ? "mt-4 text-sm" : "mt-5")}>
      {review.quote}
    </p>

    {(review.reviewUrl || review.reportUrl) && (
      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
        {review.reviewUrl && (
          <a
            href={review.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-primary transition hover:text-primary/80"
          >
            Voir sur Google
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {review.reportUrl && (
          <a
            href={review.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
          >
            <Flag className="h-4 w-4" />
            Signaler
          </a>
        )}
      </div>
    )}
  </article>
);

export default ClientReviewCard;
