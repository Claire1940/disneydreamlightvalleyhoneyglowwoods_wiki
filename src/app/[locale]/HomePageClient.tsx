"use client";

import { Suspense, lazy, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  Cloud,
  Droplets,
  Flower2,
  Gamepad2,
  Gift,
  Heart,
  Hexagon,
  Lamp,
  Lightbulb,
  MapPin,
  PawPrint,
  Play,
  Sparkles,
  Sofa,
  TreePine,
  Trophy,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Module eyebrow labels (short, thematic section tags above each module title)
type EyebrowIconName =
  | "Calendar"
  | "Gift"
  | "MapPin"
  | "Users"
  | "TreePine"
  | "Hexagon"
  | "ChefHat"
  | "Gamepad2";

const MODULE_EYEBROWS: Record<
  string,
  { label: string; icon: EyebrowIconName }
> = {
  honeyglowReleaseDatePrice: { label: "Release & Purchase", icon: "Calendar" },
  honeyglowCodesAndRewards: { label: "Codes & Rewards", icon: "Gift" },
  honeyglowBeginnerGuide: { label: "Starter Walkthrough", icon: "MapPin" },
  honeyglowCharactersGuide: { label: "Characters", icon: "Users" },
  honeyglowBiomesEveroakGuide: { label: "Map & Exploration", icon: "TreePine" },
  honeyglowBeekeepingGoldenHoney: { label: "Beekeeping", icon: "Hexagon" },
  honeyglowRecipesCrafting: { label: "Recipes & Crafting", icon: "ChefHat" },
  honeyglowPoohSticksCritters: {
    label: "Mini-Game & Critters",
    icon: "Gamepad2",
  },
};

// Maps Tools Grid card index -> target section id (1:1 with module sections below)
const TOOLS_SECTION_IDS = [
  "release-date-price",
  "codes-and-rewards",
  "beginner-guide",
  "characters-guide",
  "biomes-everoak-guide",
  "beekeeping-golden-honey",
  "recipes-crafting-guide",
  "pooh-sticks-critters-guide",
];

// Recipe & crafting category -> icon (module 7)
const RECIPE_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Core Resource": Droplets,
  Recipe: UtensilsCrossed,
  Furniture: Lamp,
  "Furniture Set": Sofa,
  Decor: Flower2,
};

// Pooh Sticks & critters category -> icon (module 8)
const POOH_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Mini-Game": Gamepad2,
  Gameplay: Play,
  Rewards: Trophy,
  Critters: PawPrint,
  "Photo Mode": Camera,
  "Side Activities": Cloud,
};

// Expandable accordion item (module 5 - biomes & Everoak Tree)
function AccordionItem({
  heading,
  content,
  highlights,
  defaultOpen = false,
}: {
  heading: string;
  content: string;
  highlights?: string[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-white/5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-4 text-left md:p-5"
      >
        <span className="font-semibold text-base md:text-lg">{heading}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3 md:px-5 md:pb-5">
          <p className="text-sm leading-7 text-muted-foreground md:text-base">
            {content}
          </p>
          {highlights && highlights.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2.5 py-1 text-xs text-[hsl(var(--nav-theme-light))]"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.disneydreamlightvalleyhoneyglowwoods.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Honeyglow Woods Wiki",
        description:
          "Complete Disney Dreamlight Valley: Honeyglow Woods guide covering quests, beekeeping, Golden Honey, Pooh Sticks, new areas, characters, recipes, rewards, and tips.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 616,
          height: 353,
          caption: "Disney Dreamlight Valley: Honeyglow Woods Adventure Pack",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Honeyglow Woods Wiki",
        alternateName: "Honeyglow Woods",
        url: siteUrl,
        description:
          "Complete Disney Dreamlight Valley: Honeyglow Woods resource hub for quests, beekeeping, Golden Honey, Pooh Sticks, areas, characters, recipes, and rewards guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 616,
          height: 353,
          caption: "Disney Dreamlight Valley: Honeyglow Woods Adventure Pack",
        },
        sameAs: [
          "https://store.steampowered.com/app/4376930/Disney_Dreamlight_Valley_Honeyglow_Woods/",
          "https://disneydreamlightvalley.com/expansion/honeyglow-woods",
          "https://www.youtube.com/@disneydreamlightvalley",
          "https://x.com/DisneyDLValley",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Disney Dreamlight Valley: Honeyglow Woods",
        gamePlatform: ["PC", "Steam", "Nintendo Switch", "PlayStation 5", "Xbox"],
        applicationCategory: "Game",
        genre: ["Life Sim", "Adventure", "Cozy", "Farming"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/4376930/Disney_Dreamlight_Valley_Honeyglow_Woods/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Disney Dreamlight Valley: Honeyglow Woods - Launch Trailer",
        description:
          "Official Honeyglow Woods launch trailer for Disney Dreamlight Valley, showcasing the new Adventure Pack areas, beekeeping, Golden Honey, and Winnie the Pooh friends.",
        uploadDate: "2026-07-08",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/MCjQjkstOhA",
        url: "https://www.youtube.com/watch?v=MCjQjkstOhA",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();
  const EyebrowIcon = ({ name }: { name: EyebrowIconName }) => {
    const map = {
      Calendar,
      Gift,
      MapPin,
      Users,
      TreePine,
      Hexagon,
      ChefHat,
      Gamepad2,
    };
    const Icon = map[name];
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes-and-rewards")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/4376930/Disney_Dreamlight_Valley_Honeyglow_Woods/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域之后 (容器宽度上限 max-w-5xl) */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <VideoFeature
              videoId="MCjQjkstOhA"
              title="Disney Dreamlight Valley: Honeyglow Woods - Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 4 Navigation Cards (位于视频区之后、Latest Updates 之前) */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date, Price, and Platforms (Table) */}
      <section id="release-date-price" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm mb-4">
              <EyebrowIcon name={MODULE_EYEBROWS.honeyglowReleaseDatePrice.icon} />
              {MODULE_EYEBROWS.honeyglowReleaseDatePrice.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowReleaseDatePrice"]}
                locale={locale}
              >
                {t.modules.honeyglowReleaseDatePrice.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.honeyglowReleaseDatePrice.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                  <th className="px-5 py-3 font-semibold">Topic</th>
                  <th className="px-5 py-3 font-semibold">Details</th>
                  <th className="px-5 py-3 font-semibold">What it means for you</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.honeyglowReleaseDatePrice.items.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-white/[0.02]" : ""}
                    >
                      <td className="border-t border-border px-5 py-4 align-top font-semibold">
                        {row.topic}
                      </td>
                      <td className="border-t border-border px-5 py-4 align-top text-[hsl(var(--nav-theme-light))]">
                        {row.details}
                      </td>
                      <td className="border-t border-border px-5 py-4 align-top text-sm text-muted-foreground">
                        {row.note}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal space-y-3 md:hidden">
            {t.modules.honeyglowReleaseDatePrice.items.map(
              (row: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-white/5 p-4"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                    {row.topic}
                  </p>
                  <p className="mb-1 font-bold">{row.details}</p>
                  <p className="text-sm text-muted-foreground">{row.note}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Codes, Twitch Drops, and Rewards (Code Cards) */}
      <section
        id="codes-and-rewards"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm mb-4">
              <EyebrowIcon name={MODULE_EYEBROWS.honeyglowCodesAndRewards.icon} />
              {MODULE_EYEBROWS.honeyglowCodesAndRewards.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowCodesAndRewards"]}
                locale={locale}
              >
                {t.modules.honeyglowCodesAndRewards.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.honeyglowCodesAndRewards.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.honeyglowCodesAndRewards.rewards.map(
              (reward: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col rounded-xl border border-border bg-white/5 p-5 md:p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                      {reward.name}
                    </h3>
                    <span className="shrink-0 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1 text-xs">
                      {reward.type}
                    </span>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Reward
                      </dt>
                      <dd>{reward.reward}</dd>
                    </div>
                    <div>
                      <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Code
                      </dt>
                      <dd>{reward.code}</dd>
                    </div>
                    <div>
                      <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        How to claim
                      </dt>
                      <dd>{reward.claim}</dd>
                    </div>
                    <div>
                      <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Delivery
                      </dt>
                      <dd>{reward.delivery}</dd>
                    </div>
                    <div>
                      <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Availability
                      </dt>
                      <dd>{reward.availability}</dd>
                    </div>
                  </dl>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide (Step-by-Step) */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm mb-4">
              <EyebrowIcon name={MODULE_EYEBROWS.honeyglowBeginnerGuide.icon} />
              {MODULE_EYEBROWS.honeyglowBeginnerGuide.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowBeginnerGuide"]}
                locale={locale}
              >
                {t.modules.honeyglowBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.honeyglowBeginnerGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.honeyglowBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-border bg-white/5 p-4 md:p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-11 w-11 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                    {step.tip && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.07)] p-3">
                        <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <p className="text-sm">
                          <span className="font-semibold">Tip: </span>
                          {step.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Characters Guide (Card List) */}
      <section
        id="characters-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm mb-4">
              <EyebrowIcon name={MODULE_EYEBROWS.honeyglowCharactersGuide.icon} />
              {MODULE_EYEBROWS.honeyglowCharactersGuide.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowCharactersGuide"]}
                locale={locale}
              >
                {t.modules.honeyglowCharactersGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.honeyglowCharactersGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.honeyglowCharactersGuide.characters.map(
              (character: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-white/5 p-5 md:p-7 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="flex items-center gap-2 text-xl md:text-2xl font-bold">
                      <Gift className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      {character.name}
                    </h3>
                    <span className="w-fit rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs">
                      {character.role}
                    </span>
                  </div>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="mb-1 font-semibold text-[hsl(var(--nav-theme-light))]">
                        Story focus
                      </dt>
                      <dd className="text-muted-foreground">{character.story}</dd>
                    </div>
                    <div>
                      <dt className="mb-1 font-semibold text-[hsl(var(--nav-theme-light))]">
                        Progression
                      </dt>
                      <dd className="text-muted-foreground">
                        {character.progression}
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-1 font-semibold text-[hsl(var(--nav-theme-light))]">
                        Why unlock
                      </dt>
                      <dd className="text-muted-foreground">
                        {character.whyUnlock}
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-1 font-semibold text-[hsl(var(--nav-theme-light))]">
                        Featured moments
                      </dt>
                      <dd className="text-muted-foreground">{character.moments}</dd>
                    </div>
                  </dl>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位: 模块 4 与模块 5 之间的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 5: Biomes and Everoak Tree (Accordion) */}
      <section
        id="biomes-everoak-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm">
              <EyebrowIcon name={MODULE_EYEBROWS.honeyglowBiomesEveroakGuide.icon} />
              {MODULE_EYEBROWS.honeyglowBiomesEveroakGuide.label}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowBiomesEveroakGuide"]}
                locale={locale}
              >
                {t.modules.honeyglowBiomesEveroakGuide.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.honeyglowBiomesEveroakGuide.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 scroll-reveal md:grid-cols-2 md:gap-4">
            {t.modules.honeyglowBiomesEveroakGuide.items.map(
              (item: any, index: number) => (
                <AccordionItem
                  key={index}
                  heading={item.heading}
                  content={item.content}
                  highlights={item.highlights}
                  defaultOpen={index === 0}
                />
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Beekeeping and Golden Honey (Step-by-Step) */}
      <section
        id="beekeeping-golden-honey"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm">
              <EyebrowIcon
                name={MODULE_EYEBROWS.honeyglowBeekeepingGoldenHoney.icon}
              />
              {MODULE_EYEBROWS.honeyglowBeekeepingGoldenHoney.label}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowBeekeepingGoldenHoney"]}
                locale={locale}
              >
                {t.modules.honeyglowBeekeepingGoldenHoney.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.honeyglowBeekeepingGoldenHoney.intro}
            </p>
          </div>
          <div className="space-y-4 scroll-reveal">
            {t.modules.honeyglowBeekeepingGoldenHoney.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:h-12 md:w-12">
                    <span className="text-base font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1.5 text-lg font-bold md:mb-2 md:text-xl">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground md:text-base">
                      {step.description}
                    </p>
                    {step.result && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.07)] p-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <p className="text-sm">
                          <span className="font-semibold">Result: </span>
                          {step.result}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位: 模块 6 与模块 7 之间的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 7: Recipes and Crafting (Card Grid) */}
      <section
        id="recipes-crafting-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm">
              <EyebrowIcon name={MODULE_EYEBROWS.honeyglowRecipesCrafting.icon} />
              {MODULE_EYEBROWS.honeyglowRecipesCrafting.label}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowRecipesCrafting"]}
                locale={locale}
              >
                {t.modules.honeyglowRecipesCrafting.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.honeyglowRecipesCrafting.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 scroll-reveal sm:grid-cols-2 md:grid-cols-3">
            {t.modules.honeyglowRecipesCrafting.items.map(
              (item: any, index: number) => {
                const Icon = RECIPE_CATEGORY_ICONS[item.category] || Sparkles;
                return (
                  <div
                    key={index}
                    className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2.5 py-1 text-xs text-[hsl(var(--nav-theme-light))]">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="mb-1.5 text-base font-bold md:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Best for
                      </p>
                      <p className="text-sm">{item.use}</p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Pooh Sticks and Critters (Card Grid) */}
      <section
        id="pooh-sticks-critters-guide"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] md:text-sm">
              <EyebrowIcon
                name={MODULE_EYEBROWS.honeyglowPoohSticksCritters.icon}
              />
              {MODULE_EYEBROWS.honeyglowPoohSticksCritters.label}
            </div>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle
                linkData={moduleLinkMap["honeyglowPoohSticksCritters"]}
                locale={locale}
              >
                {t.modules.honeyglowPoohSticksCritters.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.honeyglowPoohSticksCritters.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2">
            {t.modules.honeyglowPoohSticksCritters.items.map(
              (item: any, index: number) => {
                const Icon = POOH_CATEGORY_ICONS[item.category] || Heart;
                return (
                  <div
                    key={index}
                    className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <h3 className="text-base font-bold md:text-lg">
                        {item.title}
                      </h3>
                    </div>
                    <span className="mb-3 w-fit rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2.5 py-1 text-xs text-[hsl(var(--nav-theme-light))]">
                      {item.category}
                    </span>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.details && item.details.length > 0 && (
                      <ul className="mt-auto space-y-1.5">
                        {item.details.map((d: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/disneydreamlightvalley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/DisneyDLValley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1441590"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/4376930/Disney_Dreamlight_Valley_Honeyglow_Woods/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
