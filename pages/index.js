import { useEffect, useMemo, useState } from 'react'

export default function Home(){
  const [screen, setScreen] = useState('splash')
  const [data, setData] = useState(null)
  const [profileId, setProfileId] = useState(null)
  const [toast, setToast] = useState(null)

  // Pretty hash routing: #/splash, #/feed, #/profile/ari
  const parseHash = () => {
    const raw = (typeof window !== 'undefined' ? window.location.hash : '#/splash').slice(1); // remove '#'
    let path = raw, query = '';
    if (raw.includes('?')) { const [p, q] = raw.split('?'); path = p; query = q; }
    const segments = path.startsWith('/') ? path.slice(1).split('/') : [path];
    const params = new URLSearchParams(query || '');

    if (segments[0] === 'profile') {
      const id = segments[1] || params.get('profile') || null;
      if (id) params.set('profile', id);
      return { screen: 'profile', params };
    }

    const screen = segments[0] || 'splash';
    return { screen, params };
  };

  const setHash = (screenName, params) => {
    if (screenName === 'profile' && params?.get('profile')) {
      const id = params.get('profile');
      const q = new URLSearchParams(params); q.delete('profile');
      const qs = q.toString();
      window.location.hash = `#/profile/${id}${qs ? '?' + qs : ''}`;
      return;
    }
    const q = params && params.toString() ? ('?' + params.toString()) : '';
    window.location.hash = `#/${screenName}${q}`;
  };

  const goto = (name, params) => { setScreen(name); setHash(name, params); };
  const showToast = (msg) => { setToast(msg); setTimeout(()=> setToast(null), 2200); };

  useEffect(()=>{
    const boot = async () => {
      try{
        const res = await fetch('/data.json', { cache: 'no-store' });
        if(!res.ok) throw new Error('bad status');
        setData(await res.json());
      }catch(e){
        setData({
          venues:[
            {id:'haiku', name:'Haiku Tampa', subtitle:'Modern cocktails & cuisine'},
            {id:'ulele', name:'Ulele', subtitle:'Elevated dining on the river'},
            {id:'beacon', name:'Beacon Rooftop Bar', subtitle:'Skyline, sunset, celebration'}
          ],
          pros:[
            {id:'ari', name:'Ari', role:'Bartender', venue:'Haiku Tampa', regulars:47, tonight:'9pm – Close', about:'Let’s make tonight taste like a win.', photo:'', heroText:'Ari — Cocktail Artist'},
            {id:'uleleLegend', name:'Ulele Legend', role:'Server', venue:'Ulele', regulars:58, tonight:'Dinner service', about:'You already feel like a regular.', photo:'', heroText:'Ulele — Confident Server'},
            {id:'beaconSunset', name:'Sunset Mixologist', role:'Bartender', venue:'Beacon Rooftop Bar', regulars:63, tonight:'Golden hour — close', about:'Sunset’s better when I’m pouring.', photo:'', heroText:'Beacon — Sunset Mixologist'}
          ],
          venueToPro:{haiku:'ari', ulele:'uleleLegend', beacon:'beaconSunset'}
        });
      }
    };
    boot();
  }, []);

  useEffect(()=>{
    const apply = () => {
      const { screen, params } = parseHash();
      if(screen === 'profile' && params.get('profile')){
        setProfileId(params.get('profile'));
        setScreen('profile');
        return;
      }
      setScreen(screen || 'splash');
    };
    window.addEventListener('hashchange', apply);
    apply();
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  const profile = useMemo(()=> (data?.pros || []).find(p => p.id === profileId) || (data?.pros || [])[0], [data, profileId]);

  if(!data) return <div style={{padding:20}}>Loading…</div>;

  return (
    <div className="fade-in">
      <button className="theme-toggle" onClick={()=> document.body.classList.toggle('light')}>Light/Dark</button>

      {/* Splash */}
      <section id="screen-splash" className={`screen ${screen !== 'splash' ? 'hidden':''}`}>
        <div className="splash-hero slide-up">
          <div style={{maxWidth:600, margin:'0 auto', textAlign:'center'}}>
            <h1 className="brand">OnTonight</h1>
            <p className="tagline">Your night. Your people.<br/>Where regulars are made.</p>
            <a className="btn btn-primary" href="#/feed" onClick={(e)=>{ e.preventDefault(); goto('feed') }}>Explore tonight</a>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section id="screen-feed" className={`screen ${screen !== 'feed' ? 'hidden':''}`} aria-label="Tonight Near You">
        <header className="topbar">
          <button className="icon-btn" onClick={()=> goto('splash')} aria-label="Back">←</button>
          <h2>Tonight Near You</h2>
          <span></span>
        </header>
        <div id="feed-list" className="stack">
          {data.venues.map(v => (
            <article className="card fade-in" key={v.id}
              onClick={()=>{ const p = new URLSearchParams([['profile', data.venueToPro[v.id]]]); goto('profile', p); setProfileId(data.venueToPro[v.id]) }}>
              {v.image ? <img src={v.image} alt={v.name} style={{width:'100%', height:220, objectFit:'cover', display:'block'}}/> 
                       : <div className="img">{v.name}</div>}
              <div className="overlay" />
              <div className="meta">
                <h3>{v.name}</h3>
                <p>{v.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Profile */}
      <section id="screen-profile" className={`screen ${screen !== 'profile' ? 'hidden':''}`}>
        <header className="topbar">
          <button className="icon-btn" onClick={()=> goto('feed')} aria-label="Back to Feed">←</button>
          <h2 id="profile-venue">{profile?.venue}</h2>
          <span></span>
        </header>

        <div className="profile-hero fade-in">
          {profile?.photo
            ? <img className="img" id="profile-photo" src={profile.photo} alt="Hero" style={{width:'100%', height:360, objectFit:'cover', display:'block'}}/>
            : <div className="img" id="profile-fallback" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'#9bb', height:360}}>
                {profile?.heroText || 'Profile'}
              </div>
          }
          <div className="profile-gradient"></div>
          <div className="profile-meta slide-up">
            <h3 id="profile-name">{profile?.name} — {profile?.role}</h3>
            <p id="profile-role">{profile?.venue}</p>
            <p id="profile-regulars" className="regulars">Regulars: {profile?.regulars}</p>
            <button id="btn-regulars" className="btn btn-primary" onClick={()=> showToast(`Show up for your people — ${profile?.name} is OnTonight ✨`)}>Become a Regular ✨</button>
          </div>
        </div>

        <div className="profile-details">
          <h4>On Tonight</h4>
          <p id="profile-tonight">{profile?.tonight}</p>
          <h4>About</h4>
          <p id="profile-about">{profile?.about}</p>
        </div>
      </section>

      {/* Toast */}
      <div id="toast" className={`toast ${toast ? '' : 'hidden'}`} role="status" aria-live="polite">
        {toast}
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <button className={`nav-item ${screen==='splash'?'active':''}`} onClick={()=> goto('splash')} data-nav="splash">Home</button>
        <button className={`nav-item ${screen==='feed'?'active':''}`}   onClick={()=> goto('feed')}   data-nav="feed">Explore</button>
        <button className="nav-item" onClick={()=> showToast('OnTonight crew coming together ✨')} data-nav="ontonight">OnTonight</button>
        <button className="nav-item" onClick={()=> showToast('Your regulars live here (WIP)')} data-nav="regulars">Regulars</button>
        <button className="nav-item" onClick={()=> { setProfileId('ari'); goto('profile', new URLSearchParams([['profile','ari']])) }} data-nav="profileSelf">Profile</button>
      </nav>
    </div>
  )
}
