<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

header("Cache-Control: s-maxage=900, stale-while-revalidate=86400");

if (($_SERVER["REQUEST_METHOD"] ?? "GET") !== "GET") {
    json_response(["success" => false, "error" => "Method not allowed"], 405);
}

const GOOGLE_REVIEW_SEARCH_URL = "https://www.google.com/search?q=Taxi+Le+Havre+avis+google";
const DEFAULT_PLACE_TEXT_QUERY = "Taxi Le Havre, Le Havre, France";
const DEFAULT_MIN_RATING = 4.0;

/**
 * @return array<string, mixed>
 */
function build_fallback_reviews_payload(array $overrides = []): array
{
    $payload = [
        "success" => true,
        "provider" => "fallback",
        "live" => false,
        "minRating" => get_google_reviews_min_rating(),
        "placeId" => null,
        "placeName" => "Taxi Le Havre",
        "rating" => null,
        "userRatingCount" => null,
        "googleMapsUri" => GOOGLE_REVIEW_SEARCH_URL,
        "reviews" => [
            [
                "id" => "camille-lucas",
                "source" => "Avis Google",
                "author" => "Camille Lucas",
                "quote" => "Le chauffeur est arrivé à l'heure! Très agréable et polis à la discussion. Très serviable, j'étais en béquilles avec des difficultés à marcher et le chauffeur m'a aidé avec mes sacs. Je recommande là 100%.",
                "avatar" => "/images/reviews/camille-lucas.png",
                "rating" => 5,
                "publishedAt" => null,
                "publishedAtLabel" => null,
                "reviewUrl" => GOOGLE_REVIEW_SEARCH_URL,
                "authorUrl" => null,
                "reportUrl" => null,
            ],
            [
                "id" => "niels",
                "source" => "Avis Google",
                "author" => "Niels",
                "quote" => "Très bien, demande au dernier moment et pourtant ponctuel et efficace, prix raisonnable Merci",
                "avatar" => "/images/reviews/niels.png",
                "rating" => 5,
                "publishedAt" => null,
                "publishedAtLabel" => null,
                "reviewUrl" => GOOGLE_REVIEW_SEARCH_URL,
                "authorUrl" => null,
                "reportUrl" => null,
            ],
            [
                "id" => "raph-lm",
                "source" => "Avis Google",
                "author" => "Raph LM",
                "quote" => "J'ai appelé à minuit pour réserver un taxi à 6h15 le lendemain. Tout simplement parfait, à l'heure!",
                "avatar" => "/images/reviews/raph-lm.png",
                "rating" => 5,
                "publishedAt" => null,
                "publishedAtLabel" => null,
                "reviewUrl" => GOOGLE_REVIEW_SEARCH_URL,
                "authorUrl" => null,
                "reportUrl" => null,
            ],
        ],
    ];

    return array_merge($payload, $overrides);
}

function get_google_reviews_min_rating(): float
{
    $rawValue = trim((string) getenv("GOOGLE_REVIEWS_MIN_RATING"));
    if ($rawValue === "" || !is_numeric($rawValue)) {
        return DEFAULT_MIN_RATING;
    }

    $value = (float) $rawValue;
    return max(1.0, min(5.0, $value));
}

function get_google_place_id(): string
{
    return trim((string) getenv("GOOGLE_PLACE_ID"));
}

function get_google_place_text_query(): string
{
    $value = trim((string) getenv("GOOGLE_PLACE_TEXT_QUERY"));
    return $value !== "" ? $value : DEFAULT_PLACE_TEXT_QUERY;
}

/**
 * @return array<string, mixed>
 */
function fetch_google_json(string $url, string $apiKey, string $fieldMask, string $method = "GET", ?string $body = null): array
{
    $headers = [
        "Content-Type: application/json; charset=utf-8",
        "X-Goog-Api-Key: " . $apiKey,
        "X-Goog-FieldMask: " . $fieldMask,
    ];

    $context = stream_context_create([
        "http" => [
            "method" => $method,
            "header" => implode("\r\n", $headers),
            "content" => $body ?? "",
            "ignore_errors" => true,
            "timeout" => 10,
        ],
    ]);

    $responseBody = @file_get_contents($url, false, $context);
    $statusLine = $http_response_header[0] ?? "";
    preg_match('/\s(\d{3})\s/', (string) $statusLine, $matches);
    $statusCode = isset($matches[1]) ? (int) $matches[1] : 0;

    $decoded = json_decode((string) $responseBody, true);
    if (!is_array($decoded)) {
        $decoded = [];
    }

    if ($statusCode < 200 || $statusCode >= 300) {
        $message = $decoded["error"]["message"] ?? ("Google request failed (" . $statusCode . ")");
        throw new RuntimeException((string) $message);
    }

    return $decoded;
}

function resolve_google_place_id(string $apiKey): string
{
    $explicitPlaceId = get_google_place_id();
    if ($explicitPlaceId !== "") {
        return $explicitPlaceId;
    }

    $payload = fetch_google_json(
        "https://places.googleapis.com/v1/places:searchText",
        $apiKey,
        "places.id,places.displayName,places.formattedAddress,places.googleMapsUri",
        "POST",
        json_encode([
            "textQuery" => get_google_place_text_query(),
            "languageCode" => "fr",
            "regionCode" => "FR",
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
    );

    $placeId = $payload["places"][0]["id"] ?? "";
    if (!is_string($placeId) || trim($placeId) === "") {
        throw new RuntimeException('No Google Place found for query "' . get_google_place_text_query() . '"');
    }

    return trim($placeId);
}

/**
 * @return string
 */
function build_review_avatar_data_url(string $author): string
{
    $parts = preg_split('/\s+/', trim($author)) ?: [];
    $initials = "";
    foreach ($parts as $part) {
        $initials .= mb_substr((string) $part, 0, 1, "UTF-8");
    }
    $initials = mb_strtoupper(mb_substr($initials, 0, 2, "UTF-8"), "UTF-8");
    if ($initials === "") {
        $initials = "TL";
    }

    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none"><rect width="96" height="96" rx="48" fill="#E2E8F0"/><circle cx="48" cy="48" r="38" fill="#0F172A"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="30" font-weight="700">' . htmlspecialchars($initials, ENT_QUOTES, "UTF-8") . '</text></svg>';
    return "data:image/svg+xml;charset=UTF-8," . rawurlencode($svg);
}

function normalize_published_at_label(?string $relativeLabel, ?string $publishedAt): ?string
{
    $relative = trim((string) $relativeLabel);
    if ($relative !== "") {
        return $relative;
    }

    $value = trim((string) $publishedAt);
    if ($value === "") {
        return null;
    }

    try {
        $date = new DateTimeImmutable($value);
    } catch (Throwable $exception) {
        return null;
    }

    return $date->format("d/m/Y");
}

/**
 * @param array<string, mixed> $place
 * @return array<string, mixed>
 */
function normalize_google_place_payload(array $place): array
{
    $minRating = get_google_reviews_min_rating();
    $reviews = [];

    foreach (($place["reviews"] ?? []) as $index => $review) {
        if (!is_array($review)) {
            continue;
        }

        $rating = isset($review["rating"]) && is_numeric($review["rating"]) ? (float) $review["rating"] : 0.0;
        $quote = trim((string) (($review["originalText"]["text"] ?? $review["text"]["text"] ?? "")));
        $author = trim((string) ($review["authorAttribution"]["displayName"] ?? "")) ?: ("Client " . ((int) $index + 1));

        if ($rating < $minRating || $quote === "") {
            continue;
        }

        $reviews[] = [
            "id" => (string) ($review["name"] ?? ("google-review-" . ((int) $index + 1))),
            "source" => "Avis Google",
            "author" => $author,
            "quote" => $quote,
            "avatar" => trim((string) ($review["authorAttribution"]["photoUri"] ?? "")) ?: build_review_avatar_data_url($author),
            "rating" => min(5, max(0, $rating)),
            "publishedAt" => trim((string) ($review["publishTime"] ?? "")) ?: null,
            "publishedAtLabel" => normalize_published_at_label(
                isset($review["relativePublishTimeDescription"]) ? (string) $review["relativePublishTimeDescription"] : null,
                isset($review["publishTime"]) ? (string) $review["publishTime"] : null
            ),
            "reviewUrl" => trim((string) ($review["googleMapsUri"] ?? $place["googleMapsUri"] ?? "")) ?: null,
            "authorUrl" => trim((string) ($review["authorAttribution"]["uri"] ?? "")) ?: null,
            "reportUrl" => trim((string) ($review["flagContentUri"] ?? "")) ?: null,
        ];
    }

    usort($reviews, static function (array $left, array $right): int {
        $leftRating = (float) ($left["rating"] ?? 0);
        $rightRating = (float) ($right["rating"] ?? 0);
        if ($leftRating !== $rightRating) {
            return $rightRating <=> $leftRating;
        }

        $leftTime = isset($left["publishedAt"]) ? strtotime((string) $left["publishedAt"]) : 0;
        $rightTime = isset($right["publishedAt"]) ? strtotime((string) $right["publishedAt"]) : 0;
        return $rightTime <=> $leftTime;
    });

    return [
        "success" => true,
        "provider" => "google-places",
        "live" => true,
        "minRating" => $minRating,
        "placeId" => trim((string) ($place["id"] ?? "")) ?: null,
        "placeName" => trim((string) ($place["displayName"]["text"] ?? $place["formattedAddress"] ?? "Taxi Le Havre")) ?: "Taxi Le Havre",
        "rating" => isset($place["rating"]) && is_numeric($place["rating"]) ? (float) $place["rating"] : null,
        "userRatingCount" => isset($place["userRatingCount"]) && is_numeric($place["userRatingCount"]) ? (int) $place["userRatingCount"] : null,
        "googleMapsUri" => trim((string) ($place["googleMapsUri"] ?? "")) ?: GOOGLE_REVIEW_SEARCH_URL,
        "reviews" => array_slice($reviews, 0, 5),
    ];
}

try {
    $apiKey = trim((string) getenv("GOOGLE_PLACES_API_KEY"));
    if ($apiKey === "") {
        json_response(build_fallback_reviews_payload([
            "warning" => "GOOGLE_PLACES_API_KEY is not configured",
        ]));
    }

    $placeId = resolve_google_place_id($apiKey);
    $detailsUrl = "https://places.googleapis.com/v1/places/" . rawurlencode($placeId) . "?languageCode=fr&regionCode=FR";
    $place = fetch_google_json(
        $detailsUrl,
        $apiKey,
        "id,displayName,formattedAddress,googleMapsUri,rating,userRatingCount,reviews"
    );

    json_response(normalize_google_place_payload($place));
} catch (Throwable $exception) {
    api_log("warning", "google_reviews_fetch_failed", [
        "message" => $exception->getMessage(),
    ]);

    json_response(build_fallback_reviews_payload([
        "warning" => $exception->getMessage(),
    ]));
}
