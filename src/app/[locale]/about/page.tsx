import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.disneydreamlightvalleyhoneyglowwoods.wiki'
  const path = '/about'

  return {
    title: 'About Honeyglow Woods Wiki - Your Disney Dreamlight Valley Resource',
    description: 'Learn about Honeyglow Woods Wiki, a community-driven resource hub providing comprehensive guides, beekeeping tips, character info, quest walkthroughs, and strategies for the Disney Dreamlight Valley: Honeyglow Woods Adventure Pack.',
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Honeyglow Woods Wiki',
      title: 'About Honeyglow Woods Wiki',
      description: 'Learn about our mission to provide the best Disney Dreamlight Valley: Honeyglow Woods guides and resources.',
      images: [
        {
          url: `${siteUrl}/images/hero.webp`,
          width: 616,
          height: 353,
          alt: 'Disney Dreamlight Valley Honeyglow Woods',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Honeyglow Woods Wiki',
      description: 'Learn about our mission to provide the best Disney Dreamlight Valley: Honeyglow Woods resources.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Honeyglow Woods Wiki
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Your community-driven resource center for Disney Dreamlight Valley: Honeyglow Woods
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Welcome to Honeyglow Woods Wiki</h2>
            <p>
              Honeyglow Woods Wiki is an <strong>unofficial, fan-made resource website</strong> dedicated to helping players
              explore the Disney Dreamlight Valley: Honeyglow Woods Adventure Pack. We are a community-driven platform that
              provides comprehensive guides, beekeeping tips, area walkthroughs, character details, quest steps, and strategic
              insights to enhance your cozy valley experience.
            </p>
            <p>
              Whether you're a new player just stepping into Honeyglow Woods for the first time or a seasoned valley keeper
              chasing every Golden Honey recipe and Pooh friend reward, Honeyglow Woods Wiki is here to support you every
              step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              Our mission is simple: <strong>to empower Honeyglow Woods players with accurate, up-to-date information
              and helpful guides</strong> that help them enjoy the Adventure Pack to the fullest. We strive to:
            </p>
            <ul>
              <li><strong>Provide reliable information:</strong> Keep our content updated with the latest game changes, new quests, and reward updates</li>
              <li><strong>Build useful guides:</strong> Develop walkthroughs, beekeeping explainers, and area maps that help players make informed decisions</li>
              <li><strong>Foster community:</strong> Create a welcoming space where players can learn, share strategies, and grow together</li>
              <li><strong>Stay accessible:</strong> Keep all resources free and easy to use for players of all skill levels</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
              We envision Honeyglow Woods Wiki as the <strong>go-to destination</strong> for every Disney Dreamlight Valley
              player exploring the Honeyglow Woods Adventure Pack. We want to be the resource that players trust and rely
              on, whether they need quest help, want to master beekeeping, or are looking for the best Pooh Sticks strategy.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">📜</div>
              <h3 className="text-xl font-semibold text-white mb-2">Quest Walkthroughs</h3>
              <p className="text-slate-300">
                Step-by-step guides for main quests, character friendship quests, and unlock order so you never get stuck
                in Honeyglow Woods.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🐝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Beekeeping & Golden Honey</h3>
              <p className="text-slate-300">
                Master the Busy Bees' House, flower placement, and Golden honey generation with practical, up-to-date
                mechanics guides.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🌳</div>
              <h3 className="text-xl font-semibold text-white mb-2">Area & Everoak Guides</h3>
              <p className="text-slate-300">
                Explore the four new areas, learn how to unlock each zone, and uncover the mystery of the Everoak Tree.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🐻</div>
              <h3 className="text-xl font-semibold text-white mb-2">Character Guides</h3>
              <p className="text-slate-300">
                Get to know Winnie the Pooh, Piglet, and Eeyore, their friendship quests, rewards, and roles in the story.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🍯</div>
              <h3 className="text-xl font-semibold text-white mb-2">Recipes & Rewards</h3>
              <p className="text-slate-300">
                Discover honey-based recipes, furniture, Moonstones, and limited-time reward details all in one place.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Multilingual Support</h3>
              <p className="text-slate-300">
                Content available in multiple languages including English, Spanish, German, and French to serve players
                worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Community-Driven</h2>
            <p>
              Honeyglow Woods Wiki is built <strong>by the community, for the community</strong>. We welcome contributions,
              feedback, and suggestions from players of all skill levels. Our content is constantly evolving based on:
            </p>
            <ul>
              <li><strong>Player feedback:</strong> Your suggestions help us improve and expand our resources</li>
              <li><strong>Community discoveries:</strong> New strategies, hidden details, and pro tips shared by players</li>
              <li><strong>Game updates:</strong> We monitor official updates and patch notes and adjust our content accordingly</li>
              <li><strong>Meta shifts:</strong> We track gameplay trends and update guides based on real player experiences</li>
            </ul>
            <p>
              <strong>Want to contribute?</strong> Whether you've found a faster quest route, a new Golden Honey trick,
              or have suggestions for new guides, we'd love to hear from you! Reach out through our contact channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>About the Team</h2>
            <p>
              Honeyglow Woods Wiki is maintained by a dedicated team of passionate gamers and writers who love
              Disney Dreamlight Valley as much as you do. We're players first, constantly testing strategies, exploring
              new areas, and staying updated with the latest discoveries.
            </p>
            <p>
              Our team combines expertise in:
            </p>
            <ul>
              <li><strong>Game analysis:</strong> Deep understanding of Disney Dreamlight Valley and Honeyglow Woods mechanics</li>
              <li><strong>Web development:</strong> Building fast, user-friendly tools and interfaces</li>
              <li><strong>Content creation:</strong> Writing clear, helpful guides and tutorials</li>
              <li><strong>Community management:</strong> Listening to player feedback and fostering a positive environment</li>
            </ul>
            <p className="text-slate-400 italic text-sm">
              Project Codename: "Honeyglow" – Exploring the cozy woods together.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Important Disclaimer</h2>
            <p className="text-yellow-400/90">
              <strong>Honeyglow Woods Wiki is an unofficial fan-made website.</strong> We are NOT affiliated with,
              endorsed by, or associated with The Walt Disney Company, Gameloft SE, or the developers of Disney
              Dreamlight Valley: Honeyglow Woods.
            </p>
            <p>
              All game content, trademarks, characters, and assets are the property of their respective owners.
              We use game-related content under fair use principles for informational and educational purposes only.
            </p>
            <p>
              Honeyglow Woods Wiki is a non-profit, community resource created by fans, for fans.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you! Whether you have questions, suggestions, found a bug, or just want to say hi:
            </p>
            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                <a href="mailto:contact@disneydreamlightvalleyhoneyglowwoods.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contact@disneydreamlightvalleyhoneyglowwoods.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Bug Reports</h3>
                <a href="mailto:support@disneydreamlightvalleyhoneyglowwoods.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  support@disneydreamlightvalleyhoneyglowwoods.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Content Submissions</h3>
                <a href="mailto:contribute@disneydreamlightvalleyhoneyglowwoods.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contribute@disneydreamlightvalleyhoneyglowwoods.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
                <a href="mailto:partnerships@disneydreamlightvalleyhoneyglowwoods.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  partnerships@disneydreamlightvalleyhoneyglowwoods.wiki
                </a>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              <strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-y border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest Honeyglow Woods guides, tips, and Disney Dreamlight Valley news.
            Bookmark this site and check back regularly for new content!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[hsl(var(--nav-theme-light))] text-white font-semibold hover:opacity-90 transition"
          >
            Explore Resources
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
