// pages/index.js
import { useEffect, useMemo, useState } from 'react';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hmToMin = (hhmm) => {
  const [h, m] = (hhmm || '00:00').split(':').map(Number);
  return (h * 60 + (m || 0)) % (24 * 60);
};

const isOnTonight = (pro, now = new Date()) => {
  if (!pro?.schedule || !Array.isArray(pro.schedule)) return false;
  const today = DAY_SHORT[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();

  for (const s of pro.schedule) {
    if (!s?.day) continue;
    const start = hmToMin(s.start);
    const end = hmToMin(s.end);

    if (s.day === today) {
      if (end >= start) {
        if (mins >= start && mins <= end) return true;
      } else {
        // crosses midnight
        if (mins >= start || mins <= end) return true;
      }
    }

    // spill from yesterday past midnight
    const y = new Date(now);
    y.setDate(now.getDate() - 1);
    const yesterday = DAY_SHORT[y.getDay()];
    if (s.day === yesterday && hmToMin(s.end) < hmToMin(s.start)) {
      if (mins <= end) return true;
    }
  }
  return false;
};

export default function Home() {
  const [screen, setScreen] = useState('splash');      // splash | explore | venue | profile
  const [exploreTab, setExploreTab] = useState('on');  // 'on' | 'venues'
  const [data, setData] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [venueId, setVenueId] = useState(null);
  const [toast, setToast] = useState(null);

  // search + favorites filter (for people lists)
  const [search, setSearch] = useState('');
  const [filterFavsOnly, setFilterFavsOnly] = useState(false);

  // Regulars (persisted)
  const [regularsMap, setRegularsMap] = useState({});
  useEffect(() => {
    try { const raw = localStorage.getItem('ot_regulars'); if (raw) setRegularsMap(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ot_regulars', JSON.stringify(regularsMap)); } catch {}
  }, [regularsMap]);
  const getRegularsFor = (id, base) => (regularsMap[id] ?? base ?? 0);
  const addRegular = (id) => setRegularsMap((m) => ({ ...m, [id]: getRegularsFor(id, 0) + 1 }));

  // Favorites (persisted)
  const [favs, setFavs] = useState(new Set());
  useEffect(() => {
    try { const raw = localStorage.getItem('ot_favs'); if (raw) setFavs(new Set(JSON.parse(raw))); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ot_favs', JSON.stringify(Array.from(favs))); } catch {}
  }, [favs]);
  const toggleFav = (id) => setFavs((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const isFav = (id) => favs.has(id);

  // Hash routing helpers
  const parseHash = () => {
    const raw = (typeof window !== 'undefined' ? window.location.hash : '#/splash').slice(1);
    let path = raw, query = '';
    if (raw.includes('?')) { const [p, q] = raw.split('?'); path = p; query = q; }
    const segments = path.startsWith('/') ? path.slice(1).split('/') : [path];
    const params = new URLSearchParams(query || '');
    if (segments[0] === 'profile') {
      const id = segments[1] || params.get('profile') || null;
      if (id) params.set('profile', id);
      return { screen: 'profile', params };
    }
    if (segments[0] === 'venue') {
      const id = segments[1] || params.get('venue') || null;
      if (id) params.set('venue', id);
      return { screen: 'venue', params };
    }
    if (segments[0] === 'explore') {
      const tab = segments[1] || params.get('tab') || 'on';
      params.set('tab', tab);
      return { screen: 'explore', params };
    }
    const scr = segments[0] || 'splash';
    return { screen: scr, params };
  };
  const setHash = (screenName, params) => {
    if (screenName === 'profile' && params?.get('profile')) {
      const id = params.get('profile'); const q = new URLSearchParams(params); q.delete('profile');
      const qs = q.toString(); window.location.hash = `#/profile/${id}${qs ? '?' + qs : ''}`; return;
    }
    if (screenName === 'venue' && params?.get('venue')) {
      const id = params.get('venue'); const q = new URLSearchParams(params); q.delete('venue');
      const qs = q.toString(); window.location.hash = `#/venue/${id}${qs ? '?' + qs : ''}`; return;
    }
    if (screenName === 'explore') {
      const tab = params?.get('tab') || 'on';
      const q = new URLSearchParams(params || ''); q.set('tab', tab);
      const qs = q.toString(); window.location.hash = `#/explore/${tab}${qs ? '?' + qs : ''}`; return;
    }
    const q = params && params.toString() ? '?' + params.toString() : '';
    window.location.hash = `#/${screenName}${q}`;
  };
  const goto = (name, params) => { setScreen(name); setHash(name, params); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  // Boot data (cache-busted)
  useEffect(() => {
    const boot = async () => {
      try {
        const v = Date.now();
        const res = await fetch(`/data.json?v=${v}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('bad status');
        setData(await res.json());
      } catch {
        setData({ venues: [], pros: [], venueToPro: {} });
      }
    };
    boot();
  }, []);

  // Apply hash
  useEffect(() => {
    const apply = () => {
      const { screen, params } = parseHash();
      if (screen === 'profile' && params.get('profile')) {
        setProfileId(params.get('profile')); setScreen('profile'); return;
      }
      if (screen === 'venue' && params.get('venue')) {
        setVenueId(params.get('venue')); setScreen('venue'); return;
      }
      if (screen === 'explore') {
        const tab = params.get('tab') || 'on';
        setExploreTab(tab === 'venues' ? 'venues' : 'on');
        setScreen('explore'); return;
      }
      setScreen(screen || 'splash');
    };
    window.addEventListener('hashchange', apply);
    apply();
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  const pros = data?.pros || [];
  const venues = data?.venues || [];
  const now = new Date();

  const prosWithStatus = useMemo(
    () => pros.map((p) => ({ ...p, onTonight: isOnTonight(p, now), favorite: isFav(p.id) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pros, favs, data]
  );

  // Helpers
  const orderByOnTonight = (arr) => {
    const onNow = arr.filter((p) => p.onTonight);
    const notNow = arr.filter((p) => !p.onTonight);
    return [...onNow, ...notNow];
  };

  // FILTERS: search + favorites
  const matchesSearch = (p) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.role || '').toLowerCase().includes(q) ||
      (p.venue || '').toLowerCase().includes(q)
    );
  };

  // Explore/OnTonight list
  const explorePeople = useMemo(() => {
    let list = [...prosWithStatus];
    if (filterFavsOnly) list = list.filter((p) => p.favorite);
    list = list.filter(matchesSearch);
    return orderByOnTonight(list);
  }, [prosWithStatus, filterFavsOnly, search]);

  // Venue detail
  const venue = useMemo(() => venues.find((v) => v.id === venueId) || null, [venues, venueId]);
  const venuePeople = useMemo(() => {
    const list = prosWithStatus.filter((p) => p.venue && venue && p.venue.toLowerCase() === (venue.name || '').toLowerCase());
    return orderByOnTonight(list);
  }, [prosWithStatus, venue]);

  const profile =
    useMemo(() => pros.find((p) => p.id === profileId) || pros[0] || {}, [pros, profileId]) || {};

  const shareProfile = async () => {
    const url = `${location.origin}/#/profile/${profile?.id}`;
    const title = `OnTonight: ${profile?.name} @ ${profile?.venue}`;
    const text = `Rolling out tonight? ${profile?.name} is OnTonight ✨`;
    try {
      if (navigator.share) await navigator.share({ title, text, url });
      else { await navigator.clipboard.writeText(url); showToast('Link copied to clipboard 🔗'); }
    } catch {}
  };

  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div className="fade-in">
      <button className="theme-toggle" onClick={() => document.body.classList.toggle('light')}>
        Light/Dark
      </button>

      {/* Splash */}
      <section id="screen-splash" className={`screen ${screen !== 'splash' ? 'hidden' : ''}`}>
        <div className="splash-hero slide-up">
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h1 className="brand">OnTonight</h1>
            <p className="tagline">
              Your night. Your people.
              <br />
              Where regulars are made.
            </p>
            <a
              className="btn btn-primary"
              href="#/explore/on"
              onClick={(e) => { e.preventDefault(); const p = new URLSearchParams([['tab','on']]); goto('explore', p); }}
            >
              Explore tonight
            </a>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section id="screen-explore" className={`screen ${screen !== 'explore' ? 'hidden' : ''}`} aria-label="Explore">
        <header className="topbar">
          <button className="icon-btn" onClick={() => goto('splash')} aria-label="Back">←</button>
          <h2>Explore</h2>
          <span />
        </header>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${exploreTab === 'on' ? 'active' : ''}`}
            onClick={() => { setExploreTab('on'); goto('explore', new URLSearchParams([['tab','on']])) }}
          >
            OnTonight
          </button>
          <button
            className={`tab ${exploreTab === 'venues' ? 'active' : ''}`}
            onClick={() => { setExploreTab('venues'); goto('explore', new URLSearchParams([['tab','venues']])) }}
          >
            Venues
          </button>
        </div>

        {/* OnTonight tab */}
        <div className={`${exploreTab === 'on' ? '' : 'hidden'}`}>
          <div className="filters-row">
            <input
              className="input"
              placeholder="Search people or venues…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className={`chip ${filterFavsOnly ? 'active' : ''}`}
              onClick={() => setFilterFavsOnly((v) => !v)}
              title="Show only your favorites"
            >
              ★ Favorites
            </button>
          </div>

          <div className="stack">
            {explorePeople.map((p) => (
              <article
                className="card fade-in"
                key={p.id}
                onClick={(e) => {
                  if ((e.target).closest?.('.card-actions')) return;
                  const params = new URLSearchParams([['profile', p.id]]);
                  setProfileId(p.id); goto('profile', params);
                }}
              >
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.name}
                    style={{
                      width: '100%', height: 220, objectFit: 'cover',
                      objectPosition: '50% 20%', display: 'block'   // show more torso, less crop
                    }}
                  />
                ) : <div className="img">{p.name}</div>}
                <div className="overlay" />
                <div className="meta">
                  <div className="badges">
                    {p.onTonight && <span className="badge badge-live">OnTonight</span>}
                    {p.favorite && <span className="badge badge-fav">★ Favorite</span>}
                  </div>
                  <h3>{p.name} — {p.role}</h3>
                  <p>{p.venue}</p>
                </div>
                <div className="card-actions">
                  <button
                    className={`icon-star ${isFav(p.id) ? 'active' : ''}`}
                    title={isFav(p.id) ? 'Unfavorite' : 'Favorite'}
                    onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                  >
                    ★
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Venues tab */}
        <div className={`${exploreTab === 'venues' ? '' : 'hidden'}`}>
          <div className="stack">
            {venues.map((v) => (
              <article
                key={v.id}
                className="card venue-card fade-in"
                onClick={() => { setVenueId(v.id); goto('venue', new URLSearchParams([['venue', v.id]])); }}
                title="View tonight's crew"
              >
                <div className="venue-meta">
                  <h3>{v.name}</h3>
                  <p>{v.subtitle}</p>
                </div>
                <div className="venue-cta">View</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Venue detail */}
      <section id="screen-venue" className={`screen ${screen !== 'venue' ? 'hidden' : ''}`} aria-label="Venue Detail">
        <header className="topbar">
          <button className="icon-btn" onClick={() => goto('explore', new URLSearchParams([['tab','venues']]))} aria-label="Back">←</button>
          <h2>{venue?.name || 'Venue'}</h2>
          <span />
        </header>

        <div className="subheader">
          <span className="pill">OnTonight</span>
          <span className="subtext">{venuePeople.filter(p => p.onTonight).length} on shift</span>
        </div>

        <div className="stack">
          {venuePeople.map((p) => (
            <article
              className="card fade-in"
              key={p.id}
              onClick={(e) => {
                if ((e.target).closest?.('.card-actions')) return;
                const params = new URLSearchParams([['profile', p.id]]);
                setProfileId(p.id); goto('profile', params);
              }}
            >
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.name}
                  style={{
                    width: '100%', height: 200, objectFit: 'cover',
                    objectPosition: '50% 20%', display: 'block'
                  }}
                />
              ) : <div className="img">{p.name}</div>}
              <div className="overlay" />
              <div className="meta">
                <div className="badges">
                  {p.onTonight && <span className="badge badge-live">OnTonight</span>}
                  {p.favorite && <span className="badge badge-fav">★ Favorite</span>}
                </div>
                <h3>{p.name} — {p.role}</h3>
                <p>{p.venue}</p>
              </div>
              <div className="card-actions">
                <button
                  className={`icon-star ${isFav(p.id) ? 'active' : ''}`}
                  title={isFav(p.id) ? 'Unfavorite' : 'Favorite'}
                  onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                >
                  ★
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Profile */}
      <section id="screen-profile" className={`screen ${screen !== 'profile' ? 'hidden' : ''}`}>
        <header className="topbar">
          <button className="icon-btn" onClick={() => goto('explore', new URLSearchParams([['tab','on']]))} aria-label="Back to Explore">←</button>
          <h2 id="profile-venue">{profile?.venue}</h2>
          <span></span>
        </header>

        <div className="profile-hero fade-in">
          {profile?.photo ? (
            <img
              className="img"
              id="profile-photo"
              src={profile.photo}
              alt="Hero"
              style={{ width: '100%', height: 320, objectFit: 'cover', objectPosition: '50% 25%', display: 'block' }}
            />
          ) : (
            <div
              className="img"
              id="profile-fallback"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9bb', height: 320 }}
            >
              {profile?.heroText || 'Profile'}
            </div>
          )}
          <div className="profile-gradient"></div>
          <div className="profile-meta slide-up">
            <h3 id="profile-name">
              {profile?.name} — {profile?.role}
            </h3>
            <p id="profile-role">{profile?.venue}</p>
            <p className="regulars">Regulars: {getRegularsFor(profile?.id, profile?.regulars)}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => { addRegular(profile?.id); showToast(`Show up for your people — ${profile?.name} is OnTonight ✨`); }}>
                Become a Regular ✨
              </button>
              <button className="btn" onClick={shareProfile} aria-label="Share Profile">Share</button>
              <button className={`btn ${isFav(profile?.id) ? 'btn-fav' : ''}`} onClick={() => { toggleFav(profile?.id); showToast(isFav(profile?.id) ? 'Removed from favorites' : 'Added to favorites ★'); }}>
                {isFav(profile?.id) ? '★ Favorited' : '☆ Add Favorite'}
              </button>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <h4>On Tonight</h4>
          <p id="profile-tonight">{isOnTonight(profile, new Date()) ? 'Yes — catch them tonight!' : 'Not on tonight'}</p>
          <h4>About</h4>
          <p id="profile-about">{profile?.about}</p>
          <h4>Typical Schedule</h4>
          <ul style={{ marginTop: 6, paddingLeft: 16 }}>
            {(profile?.schedule || []).map((s, i) => (<li key={i}>{s.day} · {s.start}–{s.end}</li>))}
          </ul>
        </div>
      </section>

      {/* Toast */}
      <div id="toast" className={`toast ${toast ? '' : 'hidden'}`} role="status" aria-live="polite">{toast}</div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <button className={`nav-item ${screen === 'splash' ? 'active' : ''}`} onClick={() => goto('splash')} data-nav="splash">Home</button>
        <button className={`nav-item ${screen === 'explore' ? 'active' : ''}`} onClick={() => goto('explore', new URLSearchParams([['tab','on']]))} data-nav="explore">Explore</button>
        <button className="nav-item" onClick={() => showToast('OnTonight crew coming together ✨')} data-nav="ontonight">OnTonight</button>
        <button className="nav-item" onClick={() => showToast('Your regulars & favorites here (WIP)')} data-nav="regulars">Regulars</button>
        <button className="nav-item" onClick={() => { setProfileId('ari'); goto('profile', new URLSearchParams([['profile','ari']])) }} data-nav="profileSelf">Profile</button>
      </nav>
    </div>
  );
}
