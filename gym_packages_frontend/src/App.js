import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { createClient } from '@supabase/supabase-js';

/**
 * Royal Purple Elegant Theme constants
 */
const THEME = {
  name: 'Royal Purple',
  colors: {
    primary: '#8B5CF6',
    secondary: '#6B7280',
    success: '#10B981',
    error: '#EF4444',
    background: '#F3E8FF',
    surface: '#FFFFFF',
    text: '#374151',
    gradientFrom: '#F3E8FF',
    gradientTo: '#D8B4FE'
  },
  radius: '16px',
};

/**
 * Configure Supabase client using environment variables.
 * The environment variables must be provided by the runtime environment (.env).
 * REACT_APP_SUPABASE_URL
 * REACT_APP_SUPABASE_KEY
 */
function useSupabase() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  const client = useMemo(() => {
    if (!url || !key) return null;
    return createClient(url, key);
  }, [url, key]);

  return client;
}

/**
 * Fetch gym packages and their features from Supabase.
 * Expected database schema:
 * - Table: packages (id, name, price, billing_cycle, description, highlight)
 * - Table: package_features (id, package_id, feature, included:boolean, note:text)
 * Adjust table/column names if your schema differs.
 */
function usePackages() {
  const supabase = useSupabase();
  const [data, setData] = useState({ packages: [], loading: true, error: '' });

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!supabase) {
        setData(d => ({ ...d, loading: false, error: 'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.' }));
        return;
      }

      try {
        // Get packages
        const { data: pkgRows, error: pkgErr } = await supabase
          .from('packages')
          .select('*')
          .order('price', { ascending: true });

        if (pkgErr) throw pkgErr;

        const pkgIds = (pkgRows || []).map(p => p.id);
        // Get features for those packages
        const { data: featRows, error: featErr } = await supabase
          .from('package_features')
          .select('*')
          .in('package_id', pkgIds);

        if (featErr) throw featErr;

        // Group features by package_id
        const featuresMap = {};
        (featRows || []).forEach(f => {
          if (!featuresMap[f.package_id]) featuresMap[f.package_id] = [];
          featuresMap[f.package_id].push(f);
        });

        const packagesWithFeatures = (pkgRows || []).map(p => ({
          ...p,
          features: (featuresMap[p.id] || [])
            .sort((a, b) => (a.included === b.included ? 0 : a.included ? -1 : 1)),
        }));

        if (mounted) setData({ packages: packagesWithFeatures, loading: false, error: '' });
      } catch (err) {
        if (mounted) setData({ packages: [], loading: false, error: err.message || 'Failed to load data' });
      }
    }

    load();
    return () => { mounted = false; };
  }, [supabase]);

  return data;
}

/**
 * Header component with navigation.
 */
// PUBLIC_INTERFACE
function Header({ onToggleTheme, currentTheme }) {
  /** Elegant header with soft gradient and rounded nav */
  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        <div style={styles.brand}>
          <div style={styles.brandMark}>RG</div>
          <div>
            <div style={styles.brandTitle}>Royal Gym</div>
            <div style={styles.brandSubtitle}>Strength & Serenity</div>
          </div>
        </div>
        <nav style={styles.nav}>
          <a href="#packages" style={styles.navLink}>Packages</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </nav>
        <button onClick={onToggleTheme} style={styles.themeButton} aria-label="Toggle theme">
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

/**
 * Single package card component
 */
// PUBLIC_INTERFACE
function PackageCard({ pkg }) {
  const isHighlighted = pkg.highlight === true || pkg.highlight === 'true' || pkg.highlight === 1;

  return (
    <div style={{ ...styles.card, ...(isHighlighted ? styles.cardHighlight : {}) }}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{pkg.name}</h3>
        <div style={styles.priceRow}>
          <span style={styles.price}>${Number(pkg.price).toFixed(2)}</span>
          <span style={styles.billing}>/{pkg.billing_cycle || 'mo'}</span>
        </div>
        {pkg.description ? <p style={styles.cardSubtitle}>{pkg.description}</p> : null}
      </div>
      <ul style={styles.featuresList} aria-label={`${pkg.name} features`}>
        {Array.isArray(pkg.features) && pkg.features.length > 0 ? (
          pkg.features.map((f) => (
            <li key={f.id} style={styles.featureItem}>
              <span
                style={{
                  ...styles.featureBadge,
                  backgroundColor: f.included ? THEME.colors.success : THEME.colors.secondary,
                }}
                aria-hidden
              />
              <span style={{ ...styles.featureText, color: f.included ? THEME.colors.text : '#6b7280' }}>
                {f.feature}
              </span>
              {f.note ? <span style={styles.featureNote}> • {f.note}</span> : null}
            </li>
          ))
        ) : (
          <li style={styles.featureItem}><span style={styles.featureText}>No features listed</span></li>
        )}
      </ul>
      <button style={styles.ctaButton} aria-label={`Choose ${pkg.name} package`}>
        Choose {pkg.name}
      </button>
    </div>
  );
}

/**
 * Footer with contact info
 */
// PUBLIC_INTERFACE
function Footer() {
  return (
    <footer style={styles.footer} id="contact">
      <div style={styles.footerInner}>
        <div>
          <div style={styles.footerTitle}>Royal Gym</div>
          <div style={styles.footerSub}>Strength, Balance, Elegance.</div>
        </div>
        <div style={styles.footerGrid}>
          <div>
            <div style={styles.footerHeading}>Contact</div>
            <div style={styles.footerText}>123 Lumina Ave, Suite 200</div>
            <div style={styles.footerText}>Silver City, SC 90210</div>
            <div style={styles.footerText}>Phone: (555) 123-4567</div>
            <div style={styles.footerText}>Email: hello@royalgym.fit</div>
          </div>
          <div>
            <div style={styles.footerHeading}>Hours</div>
            <div style={styles.footerText}>Mon–Fri: 6:00am – 10:00pm</div>
            <div style={styles.footerText}>Sat–Sun: 8:00am – 8:00pm</div>
          </div>
        </div>
        <div style={styles.copyRow}>
          <span>© {new Date().getFullYear()} Royal Gym. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/**
 * App root component – assembles header, main package list, and footer.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const { packages, loading, error } = usePackages();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App" style={styles.app}>
      <Header onToggleTheme={toggleTheme} currentTheme={theme} />
      <main id="packages" style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroInner}>
            <h1 style={styles.heroTitle}>Find Your Perfect Plan</h1>
            <p style={styles.heroSubtitle}>
              Elegant, flexible memberships designed to meet your goals. Unlock all the amenities with a plan that fits your lifestyle.
            </p>
          </div>
        </section>

        <section aria-live="polite" style={styles.gridSection}>
          {loading && <div style={styles.statusNote}>Loading packages…</div>}
          {error && <div style={{ ...styles.statusNote, color: THEME.colors.error }}>Error: {error}</div>}
          {!loading && !error && packages.length === 0 && (
            <div style={styles.statusNote}>No packages available yet. Please add them in Supabase.</div>
          )}
          <div style={styles.grid}>
            {packages.map(p => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  app: {
    background: `linear-gradient(180deg, ${THEME.colors.gradientFrom}, ${THEME.colors.gradientTo})`,
    color: THEME.colors.text,
    minHeight: '100vh',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'saturate(180%) blur(8px)',
    borderBottom: `1px solid rgba(139, 92, 246, 0.25)`,
  },
  headerInner: {
    maxWidth: 1140,
    margin: '0 auto',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: THEME.colors.primary,
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    letterSpacing: 1,
    boxShadow: '0 6px 16px rgba(139, 92, 246, 0.35)',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: THEME.colors.text,
  },
  brandSubtitle: {
    fontSize: 12,
    color: THEME.colors.secondary,
  },
  nav: {
    display: 'flex',
    gap: 16,
  },
  navLink: {
    color: THEME.colors.text,
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: 999,
    border: '1px solid rgba(107,114,128,0.25)',
  },
  themeButton: {
    marginLeft: 'auto',
    border: 'none',
    background: THEME.colors.primary,
    color: '#FFF',
    padding: '8px 12px',
    borderRadius: 999,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(139, 92, 246, 0.35)',
  },
  main: {
    maxWidth: 1140,
    margin: '0 auto',
    padding: '40px 20px 80px',
  },
  hero: {
    padding: '24px 0 8px',
  },
  heroInner: {
    background: `linear-gradient(135deg, rgba(139,92,246,0.10), rgba(216,180,254,0.25))`,
    border: '1px solid rgba(139, 92, 246, 0.25)',
    borderRadius: THEME.radius,
    padding: '32px 24px',
    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.15)',
  },
  heroTitle: {
    fontSize: 36,
    margin: '0 0 8px',
    color: THEME.colors.text,
  },
  heroSubtitle: {
    fontSize: 16,
    margin: 0,
    color: THEME.colors.secondary,
    maxWidth: 720,
  },
  gridSection: {
    marginTop: 28,
  },
  grid: {
    marginTop: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
  },
  card: {
    background: THEME.colors.surface,
    borderRadius: THEME.radius,
    border: '1px solid rgba(139, 92, 246, 0.25)',
    boxShadow: '0 10px 20px rgba(139, 92, 246, 0.10)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  cardHighlight: {
    outline: `2px solid ${THEME.colors.primary}`,
    boxShadow: '0 16px 36px rgba(139, 92, 246, 0.25)',
    transform: 'translateY(-2px)',
  },
  cardHeader: {
    borderBottom: '1px dashed rgba(107,114,128,0.35)',
    paddingBottom: 12,
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    color: THEME.colors.text,
  },
  cardSubtitle: {
    margin: '8px 0 0',
    color: THEME.colors.secondary,
    fontSize: 14,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 6,
  },
  price: {
    fontSize: 28,
    fontWeight: 800,
    color: THEME.colors.primary,
  },
  billing: {
    fontSize: 14,
    color: THEME.colors.secondary,
  },
  featuresList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minHeight: 80,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  featureBadge: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
  featureText: {
    fontSize: 14,
  },
  featureNote: {
    fontSize: 12,
    color: THEME.colors.secondary,
  },
  ctaButton: {
    marginTop: 'auto',
    background: THEME.colors.primary,
    color: '#fff',
    border: 'none',
    padding: '12px 16px',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: 0.5,
    boxShadow: '0 10px 20px rgba(139, 92, 246, 0.25)',
  },
  footer: {
    background: 'rgba(255,255,255,0.85)',
    borderTop: '1px solid rgba(139, 92, 246, 0.25)',
    marginTop: 40,
  },
  footerInner: {
    maxWidth: 1140,
    margin: '0 auto',
    padding: '28px 20px 40px',
  },
  footerTitle: {
    fontWeight: 800,
    color: THEME.colors.text,
    fontSize: 18,
  },
  footerSub: {
    color: THEME.colors.secondary,
    fontSize: 14,
  },
  footerGrid: {
    marginTop: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  footerHeading: {
    color: THEME.colors.text,
    fontWeight: 700,
    marginBottom: 8,
  },
  footerText: {
    color: THEME.colors.secondary,
    fontSize: 14,
    margin: '2px 0',
  },
  copyRow: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid rgba(107,114,128,0.25)',
    color: THEME.colors.secondary,
    fontSize: 12,
  },
};

export default App;
