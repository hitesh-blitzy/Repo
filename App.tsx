import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

/* ------------------------------------------------------------------ data -- */

const COMPANIES = ['All', 'Microsoft', 'Figma', 'Monzo', 'Swiggy', 'ShareChat', 'Licious', 'Freelance']

const LOGO_STRIP = [
  'Netflix', 'Google', 'Apple', 'Uber', 'Swiggy', 'CRED', 'Zomato', 'Flipkart', 'Microsoft', 'Meta',
]

const EXPERIENCE = ['Under 1 year', '1–3 years', '4–6 years', '7–10 years', '11–15 years', '15+ years']

const DESIGNATIONS = [
  'Product Designer',
  'Senior Product Designer',
  'Lead Product Designer',
  'Senior Visual Designer',
  'UX/UI Designer',
  'Design Engineer',
  'Brand Designer',
  'Motion Designer',
  'Head of Design',
  'Co-Founder & CPO',
]

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'UAE', 'Germany', 'New Zealand', 'Spain']

const STYLES = ['Minimal', 'Dark Theme', 'Interactive', 'Creative', 'Modern Layout'] as const
type Style = (typeof STYLES)[number]

type Designer = {
  name: string
  role: string
  country: string
  style: Style
  years: number
  companies: string[]
  open?: boolean
}

const DESIGNERS: Designer[] = [
  { name: 'Tee Hodgson', role: 'Senior Visual Designer', country: 'New Zealand', style: 'Interactive', years: 12, companies: ['Figma'] },
  { name: 'Divesh Borse', role: 'Lead Product Designer', country: 'India', style: 'Dark Theme', years: 10, companies: ['JazzX AI', 'Microsoft'], open: true },
  { name: 'Aarya Vaidya', role: 'UX/UI Designer', country: 'India', style: 'Interactive', years: 3, companies: ['Feelpixel', 'Freelance'] },
  { name: 'Adarsh Panikkar', role: 'Co-Founder & CPO', country: 'UAE', style: 'Minimal', years: 4, companies: ['Kitt'] },
  { name: 'Tobias Ecsedy', role: 'Lead Product Designer', country: 'United States', style: 'Dark Theme', years: 11, companies: ['Freelance'], open: true },
  { name: 'Shreyas Vyas', role: 'Product Designer', country: 'India', style: 'Interactive', years: 2, companies: ['Digit'] },
  { name: 'Aanchal Dua', role: 'Senior Product Designer', country: 'India', style: 'Creative', years: 6, companies: ['Apollo 247', 'ShareChat'] },
  { name: 'Kousik Dutta', role: 'Design Engineer', country: 'India', style: 'Dark Theme', years: 4, companies: ['Precisely', 'ThoughtSpot'], open: true },
  { name: 'Santrupti Patil', role: 'Product Designer', country: 'India', style: 'Modern Layout', years: 4, companies: ['Licious'] },
  { name: 'Marta Ibáñez', role: 'Brand Designer', country: 'Spain', style: 'Creative', years: 8, companies: ['Glovo', 'Freelance'] },
  { name: 'Noel Abraham', role: 'Motion Designer', country: 'United Kingdom', style: 'Interactive', years: 7, companies: ['Monzo'], open: true },
  { name: 'Hanna Weiss', role: 'Head of Design', country: 'Germany', style: 'Minimal', years: 16, companies: ['Personio', 'Microsoft'] },
]

const SPOTLIGHT = [
  { rank: 1, name: 'Aanchal Maratha', role: 'Lead Visual Designer', blurb: 'Bold visual identity, editorial layouts, and a level of craft that survives close reading.' },
  { rank: 2, name: 'Parul Aggarwal', role: 'Senior UX Designer', blurb: 'Turns messy user research into measurable business outcomes — and shows all the working.' },
  { rank: 3, name: 'Smriti Rawat', role: 'Product Designer', blurb: 'Work spanning AI tooling, live sports, commerce and hiring, with unusually clear writing.' },
  { rank: 4, name: 'Raghav Dua', role: 'Design Founder', blurb: 'Refined visual craft and polished interaction detail across a decade of studio work.' },
  { rank: 5, name: 'Mohd Bilal', role: 'Senior Product Designer', blurb: 'Growth, monetisation and consumer surfaces for products with millions of daily users.' },
]

const CATEGORIES: { label: Style; count: string }[] = [
  { label: 'Minimal', count: '710+' },
  { label: 'Dark Theme', count: '350+' },
  { label: 'Interactive', count: '280+' },
  { label: 'Creative', count: '170+' },
  { label: 'Modern Layout', count: '90+' },
]

/* -------------------------------------------------------------- primitives */

const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('')

function Mono({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${className}`}>{children}</span>
}

function SectionHead({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <div className="mb-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-border pb-4">
      <Mono className="text-accent">§ {index}</Mono>
      <h2 className="font-serif text-3xl font-normal tracking-[-0.01em] md:text-[2.6rem]">{title}</h2>
      {note && <span className="ml-auto text-sm text-muted-foreground">{note}</span>}
    </div>
  )
}

/** Deterministic plate artwork per entry — keeps the wall coherent without stock photos. */
function Plate({ style, seed }: { style: Style; seed: number }) {
  const palettes: Record<Style, [string, string]> = {
    Minimal: ['#e7e2d6', '#c5bfae'],
    'Dark Theme': ['#1f1d17', '#403c31'],
    Interactive: ['#9c3b1b', '#d9905f'],
    Creative: ['#2f4739', '#84a37f'],
    'Modern Layout': ['#383d55', '#8d93af'],
  }
  const [a, b] = palettes[style]
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden border-b border-border"
      style={{ background: `linear-gradient(${115 + (seed % 5) * 21}deg, ${a}, ${b})` }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.12) 1px, transparent 1px)',
          backgroundSize: `${18 + (seed % 3) * 9}px ${18 + (seed % 3) * 9}px`,
        }}
      />
      <div
        className="absolute rounded-full mix-blend-overlay"
        style={{
          width: '56%',
          aspectRatio: '1',
          left: `${8 + (seed % 5) * 9}%`,
          top: `${10 + (seed % 4) * 11}%`,
          background: 'radial-gradient(circle at 32% 30%, rgba(255,255,255,.8), transparent 66%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
        <Mono className="text-[10px] text-white/85">{style}</Mono>
        <Mono className="text-[10px] text-white/60">{String(seed).padStart(3, '0')}</Mono>
      </div>
    </div>
  )
}

function BookmarkButton({ name }: { name: string }) {
  const [saved, setSaved] = useState(false)
  return (
    <button
      onClick={() => setSaved((s) => !s)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from bookmarks` : `Bookmark ${name}`}
      className={`absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center border bg-card/90 backdrop-blur transition ${
        saved ? 'border-accent text-accent' : 'border-border text-foreground hover:border-accent hover:text-accent'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3h12v18l-6-4.5L6 21z" />
      </svg>
    </button>
  )
}

function Chip({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition ${
        active
          ? 'border-foreground bg-foreground text-primary-foreground'
          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

function Facet({
  title,
  options,
  selected,
  toggle,
  limit = 5,
}: {
  title: string
  options: string[]
  selected: string[]
  toggle: (v: string) => void
  limit?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? options : options.slice(0, limit)
  return (
    <div className="border-b border-border py-5">
      <Mono className="text-muted-foreground">{title}</Mono>
      <ul className="mt-3 space-y-2">
        {shown.map((o) => (
          <li key={o}>
            <label className="group flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
                className="h-3.5 w-3.5 shrink-0 appearance-none border border-border bg-card transition checked:border-accent checked:bg-accent"
              />
              <span className="text-secondary-foreground transition group-hover:text-foreground">{o}</span>
            </label>
          </li>
        ))}
      </ul>
      {options.length > limit && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent underline underline-offset-4"
        >
          {expanded ? 'Show less' : `Show ${options.length - limit} more`}
        </button>
      )}
    </div>
  )
}

/* --------------------------------------------------------------- sections */

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center gap-8 px-6 py-4">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-serif text-xl tracking-tight">Wall of Portfolios</span>
          <Mono className="hidden text-accent sm:inline">est. 2024</Mono>
        </a>
        <nav className="hidden gap-6 text-sm text-secondary-foreground lg:flex">
          {['Portfolios', 'Case Studies', 'Job Tracker'].map((l) => (
            <a key={l} href="#index" className="transition hover:text-accent">{l}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <a href="#index" className="hidden text-sm text-secondary-foreground transition hover:text-accent sm:block">
            Log in
          </a>
          <a
            href="#submit"
            className="border border-foreground bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition hover:border-accent hover:bg-accent"
          >
            Submit portfolio
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="border-b border-border">
      <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div>
            <Mono className="text-accent">A curated index of design work</Mono>
            <h1 className="mt-6 font-serif text-[2.7rem] leading-[1.03] tracking-[-0.02em] md:text-[4.5rem]">
              Discover, connect &amp; hire designers building{' '}
              <em className="italic text-accent">world-class</em> products.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-secondary-foreground md:text-lg">
              Every portfolio here is read, ranked and shelved by hand. Browse the collection, or
              write to a designer for mentorship, contract work, or a full-time role.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#index"
                className="border border-foreground bg-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition hover:border-accent hover:bg-accent"
              >
                Browse the wall
              </a>
              <a
                href="#submit"
                className="border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition hover:border-foreground"
              >
                Submit yours — free
              </a>
            </div>
          </div>
          <dl className="grid grid-cols-3 content-start gap-y-8 border-t border-border pt-8 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {[
              ['30,000+', 'Designers subscribed'],
              ['1,620', 'Portfolios shelved'],
              ['48', 'Countries represented'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-serif text-3xl md:text-4xl">{n}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-border bg-secondary/60 py-4">
        <div className="mx-auto flex max-w-[1240px] items-center gap-8 px-6">
          <Mono className="hidden shrink-0 text-muted-foreground md:block">Trusted by designers from</Mono>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee gap-12 pr-12">
              {[...LOGO_STRIP, ...LOGO_STRIP].map((c, i) => (
                <span key={i} className="font-serif text-lg text-muted-foreground">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Spotlight() {
  const [active, setActive] = useState(0)
  const item = SPOTLIGHT[active]
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
        <SectionHead index="01" title="Portfolio of the month" note="{ July 2026 }" />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ol className="divide-y divide-border border-y border-border">
            {SPOTLIGHT.map((s, i) => (
              <li key={s.name}>
                <button
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={`flex w-full items-center gap-5 py-4 pr-3 text-left transition ${
                    i === active ? 'bg-card pl-4' : 'pl-0 hover:pl-2'
                  }`}
                >
                  <Mono className={i === active ? 'text-accent' : 'text-muted-foreground'}>#{s.rank}</Mono>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary font-mono text-xs">
                    {initials(s.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-serif text-xl">{s.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">{s.role}</span>
                  </span>
                  {i === active && <span className="ml-auto text-accent">→</span>}
                </button>
              </li>
            ))}
          </ol>
          <figure className="flex flex-col justify-between border border-border bg-card p-8 md:p-10">
            <div>
              <Mono className="text-muted-foreground">{'{ July 2026 }'} · Rank #{item.rank}</Mono>
              <blockquote className="mt-6 font-serif text-2xl leading-snug md:text-[2rem]">
                “{item.blurb}”
              </blockquote>
            </div>
            <figcaption className="mt-10 flex items-end justify-between gap-6 border-t border-border pt-6">
              <div>
                <div className="font-serif text-xl">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.role}</div>
              </div>
              <a
                href="#index"
                className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-accent underline underline-offset-4"
              >
                See profile ↗
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function Categories({ onPick }: { onPick: (s: Style) => void }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
        <SectionHead index="02" title="Explore top categories" note="Five shelves, one wall" />
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              onClick={() => onPick(c.label)}
              className="group bg-background text-left transition hover:bg-card"
            >
              <Plate style={c.label} seed={i * 17 + 3} />
              <div className="flex items-baseline justify-between p-4">
                <span className="font-serif text-lg transition group-hover:text-accent">{c.label}</span>
                <Mono className="text-muted-foreground">{c.count}</Mono>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function DesignerCard({ d, seed }: { d: Designer; seed: number }) {
  return (
    <article className="group relative flex flex-col border border-border bg-card transition hover:-translate-y-0.5 hover:border-foreground">
      <BookmarkButton name={d.name} />
      <Plate style={d.style} seed={seed} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary font-mono text-[11px]">
            {initials(d.name)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg leading-tight">{d.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{d.country}</p>
          </div>
          {d.open && (
            <span className="ml-auto shrink-0 border border-accent px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
              Open to work
            </span>
          )}
        </div>
        <p className="mt-4 text-sm text-secondary-foreground">{d.role}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Mono className="text-muted-foreground">{d.years} yrs</Mono>
          <span className="text-border">/</span>
          {d.companies.map((c) => (
            <span key={c} className="bg-secondary px-2 py-1 text-[11px] text-secondary-foreground">{c}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

const inBand = (years: number, band: string) => {
  if (band === 'Under 1 year') return years < 1
  if (band === '15+ years') return years >= 15
  const [lo, hi] = band.replace(' years', '').split('–').map(Number)
  return years >= lo && years <= hi
}

function Index({
  styles,
  setStyles,
}: {
  styles: string[]
  setStyles: Dispatch<SetStateAction<string[]>>
}) {
  const [company, setCompany] = useState('All')
  const [query, setQuery] = useState('')
  const [exp, setExp] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [openOnly, setOpenOnly] = useState(false)

  const toggler = (set: Dispatch<SetStateAction<string[]>>) => (v: string) =>
    set((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]))

  const results = useMemo(
    () =>
      DESIGNERS.filter((d) => {
        if (company !== 'All' && !d.companies.includes(company)) return false
        if (openOnly && !d.open) return false
        if (exp.length && !exp.some((b) => inBand(d.years, b))) return false
        if (roles.length && !roles.includes(d.role)) return false
        if (countries.length && !countries.includes(d.country)) return false
        if (styles.length && !styles.includes(d.style)) return false
        if (query) {
          const hay = `${d.name} ${d.role} ${d.country} ${d.companies.join(' ')}`.toLowerCase()
          if (!hay.includes(query.toLowerCase())) return false
        }
        return true
      }),
    [company, openOnly, exp, roles, countries, styles, query],
  )

  const activeCount = exp.length + roles.length + countries.length + styles.length + (openOnly ? 1 : 0)

  const clearAll = () => {
    setExp([])
    setRoles([])
    setCountries([])
    setStyles([])
    setOpenOnly(false)
    setQuery('')
    setCompany('All')
  }

  return (
    <section id="index" className="border-b border-border scroll-mt-20">
      <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
        <SectionHead
          index="03"
          title="Curated portfolios for you"
          note={`${results.length} of ${DESIGNERS.length} entries`}
        />

        <div className="mb-8 flex flex-wrap items-center gap-2">
          {COMPANIES.map((c) => (
            <Chip key={c} active={company === c} onClick={() => setCompany(c)}>{c}</Chip>
          ))}
          <label className="ml-auto flex items-center gap-2 border border-border bg-card px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search names, roles, companies"
              aria-label="Search portfolios"
              className="w-52 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        <div className="grid gap-10 lg:grid-cols-[248px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between border-b border-foreground pb-3">
              <Mono>Filters</Mono>
              <Mono className="text-accent">{activeCount} active</Mono>
            </div>
            <Facet title="Years of experience" options={EXPERIENCE} selected={exp} toggle={toggler(setExp)} />
            <Facet title="Designation" options={DESIGNATIONS} selected={roles} toggle={toggler(setRoles)} />
            <Facet title="Country" options={COUNTRIES} selected={countries} toggle={toggler(setCountries)} limit={4} />
            <Facet title="Style" options={[...STYLES]} selected={styles} toggle={toggler(setStyles)} />
            <label className="flex cursor-pointer items-center justify-between gap-3 border-b border-border py-5 text-sm">
              <span className="text-secondary-foreground">Only designers open to work</span>
              <span className={`relative h-5 w-9 shrink-0 border transition ${openOnly ? 'border-accent bg-accent' : 'border-border bg-card'}`}>
                <span
                  className={`absolute top-0.5 h-3.5 w-3.5 transition-all ${
                    openOnly ? 'left-[18px] bg-accent-foreground' : 'left-0.5 bg-muted-foreground'
                  }`}
                />
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={() => setOpenOnly((o) => !o)}
                  aria-label="Only designers open to work"
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </span>
            </label>
            <button
              onClick={clearAll}
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent underline underline-offset-4"
            >
              Clear all filters
            </button>
          </aside>

          {results.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((d, i) => (
                <DesignerCard key={d.name} d={d} seed={i * 29 + 11} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center border border-dashed border-border py-24 text-center">
              <div>
                <p className="font-serif text-2xl">Nothing on this shelf yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loosen a filter or two — the wall is wider than it looks.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-6 border border-foreground px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition hover:bg-foreground hover:text-primary-foreground"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function SubmitCta() {
  const [sent, setSent] = useState(false)
  return (
    <section id="submit" className="border-b border-border bg-foreground text-primary-foreground scroll-mt-20">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <Mono className="text-[#e0a077]">§ 04 — Submissions</Mono>
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] md:text-6xl">
            Showcase your portfolio
            <br />
            <em className="italic text-[#e0a077]">to a global audience.</em>
          </h2>
        </div>
        <div className="lg:pb-2">
          <p className="text-white/75">
            Submissions are read every Monday. Free, no account required, and we write back either
            way with notes on what we saw.
          </p>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <input
              type="url"
              required
              placeholder="yourportfolio.com"
              aria-label="Portfolio URL"
              className="min-w-0 flex-1 border border-white/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/45 focus:border-[#e0a077]"
            />
            <button className="shrink-0 bg-[#e0a077] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition hover:bg-white">
              Submit
            </button>
          </form>
          <p className="mt-3 h-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#e0a077]">
            {sent ? 'Received — we will be in touch by Friday.' : ''}
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    { title: 'Explore', links: ['Portfolios', 'Case Studies', 'Job Tracker', 'Bookmarks'] },
    { title: 'Categories', links: [...STYLES] },
    { title: 'Follow', links: ['Twitter / X', 'Instagram', 'LinkedIn', 'YouTube'] },
  ]
  return (
    <footer className="mx-auto max-w-[1240px] px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,0.86fr)]">
        <div>
          <div className="font-serif text-2xl">Wall of Portfolios</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A hand-kept index of designers and the work they are proud of.
          </p>
          <a href="#top" className="mt-4 inline-block text-sm text-accent underline underline-offset-4">
            support@wallofportfolios.in
          </a>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <Mono className="text-muted-foreground">{c.title}</Mono>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#top" className="text-secondary-foreground transition hover:text-accent">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Mono className="text-muted-foreground">Made with care · MMXXVI</Mono>
        <div className="ml-auto flex gap-6 text-sm text-muted-foreground">
          <a href="#top" className="transition hover:text-accent">Terms of Service</a>
          <a href="#top" className="transition hover:text-accent">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------- app */

export default function App() {
  const [styles, setStyles] = useState<string[]>([])
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Spotlight />
        <Categories
          onPick={(s) => {
            setStyles([s])
            document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        <Index styles={styles} setStyles={setStyles} />
        <SubmitCta />
      </main>
      <Footer />
    </div>
  )
}
