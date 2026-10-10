import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";


const photos = [
  {
    src: "public/photos/1.jpeg",
    alt: "Temporary portrait placeholder — replace with Diya's photo",
    title: "Her beautiful smile",
    note: "A moment to remember",
  },
  {
    src: "public/photos/2.jpeg",
    alt: "Temporary portrait placeholder — replace with Diya's photo",
    title: "Her own little world",
    note: "Simply being herself",
  },
  {
    src: "public/photos/3.jpeg",
    alt: "Temporary portrait placeholder — replace with Diya's photo",
    title: "A memory to keep",
    note: "One for the album",
  },
];

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg className={`leaf ${className}`} viewBox="0 0 240 150" fill="none" aria-hidden="true">
      <path d="M18 133C72 116 110 76 143 20" />
      <path d="M67 111C52 84 57 64 78 51c8 25 5 44-11 60Z" />
      <path d="M105 77c-3-29 8-48 33-57 1 25-10 44-33 57Z" />
      <path d="M101 82c25-14 47-12 65 6-24 14-46 12-65-6Z" />
      <path d="M42 124c-6-22 1-38 21-49 4 22-3 38-21 49Z" />
      <circle cx="167" cy="38" r="4" />
      <circle cx="183" cy="56" r="3" />
    </svg>
  );
}

function Button({ children, onClick, type = "button", secondary = false }: {
  children: ReactNode; onClick?: () => void; type?: "button" | "submit"; secondary?: boolean;
}) {
  return <button type={type} onClick={onClick} className={`button ${secondary ? "button-secondary" : ""}`}>{children}</button>;
}


function MusicControl({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const [status, setStatus] = useState<
    "ready" | "playing" | "paused" | "error"
  >("ready");

  useEffect(() => {
    const player = audioRef.current;
    if (!player) return;

    const handlePlay = () => setStatus("playing");
    const handlePause = () => setStatus("paused");
    const handleError = () => setStatus("error");

    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);
    player.addEventListener("error", handleError);

    if (!player.paused) setStatus("playing");

    return () => {
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
      player.removeEventListener("error", handleError);
    };
  }, [audioRef]);

  async function toggle() {
    const player = audioRef.current;
    if (!player || status === "error") return;

    if (!player.paused) {
      player.pause();
    } else {
      try {
        await player.play();
      } catch (error) {
        console.error("Music playback failed:", error);
        setStatus("error");
      }
    }
  }

  const label =
    status === "playing"
      ? "Pause music"
      : status === "error"
      ? "Music unavailable"
      : "Play music";

  return (
    <button
      className={`music ${status}`}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {status === "error" ? "!" : status === "playing" ? (
        <span className="equalizer"><i /><i /><i /></span>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18V5l10-2v13M9 8l10-2M6.5 21C4.6 21 3 20 3 18.7s1.6-2.3 3.5-2.3S10 17.4 10 18.7 8.4 21 6.5 21Zm10-2c-1.9 0-3.5-1-3.5-2.3s1.6-2.3-3.5-2.3 3.5 1 3.5 2.3-1.6 2.3-3.5 2.3Z" />
        </svg>
      )}
    </button>
  );
}


function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function Frame({ scene, children, onBack }: { scene: number; children: ReactNode; onBack?: () => void }) {
  function moveDecorations(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    event.currentTarget.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth - 0.5) * 2}`);
    event.currentTarget.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight - 0.5) * 2}`);
  }

  return (
    <main className={`scene scene-${scene}`} onPointerMove={moveDecorations}>
      <Leaf className="corner corner-a" />
      <Leaf className="corner corner-b" />
      {onBack && <button className="back" onClick={onBack} aria-label="Previous scene">← <span>Back</span></button>}
      <div className="scene-content">{children}</div>
      <div className="progress" aria-label={`Scene ${scene} of 7`}>
        <span className="scene-count">0{scene} / 07</span>
        <div className="dots">{[1, 2, 3, 4, 5, 6, 7].map((n) => <i key={n} className={n === scene ? "active" : ""} />)}</div>
      </div>
    </main>
  );
}

function PasswordGate({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"default" | "loading" | "error">("default");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("loading");
    // Set VITE_AUTH_ENDPOINT to a server endpoint in production. The preview fallback
    // is intentionally isolated here and must be replaced before public deployment.
    const endpoint = import.meta.env.VITE_AUTH_ENDPOINT;
    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (response.ok) return onUnlock();
      } catch { /* show the same discreet error */ }
      return setState("error");
    }
    if (password === "111006") onUnlock();
    else setState("error");
  }

  return (
    <main className="gate">
      <Leaf className="gate-leaf" />
      <div className="gate-copy">
        <Eyebrow>A little birthday gift</Eyebrow>
        <h1>A little world for Diya</h1>
        <p>Some moments deserve to be celebrated a little differently.</p>
        <p>I've made a little something for you — a place filled with smiles, beautiful memories, and birthday wishes. Take a deep breath, get comfortable, and come on in.</p>
      </div>
      <form className={`gate-form ${state === "error" ? "has-error" : ""}`} onSubmit={submit}>
        <label htmlFor="secret">Your secret little key</label>
        <input id="secret" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setState("default"); }} placeholder="Enter the password" required />
        {state === "error" && <p className="error">Not quite! Try that little key again ♡</p>}
        <Button type="submit">{state === "loading" ? "Opening…" : "Unlock my birthday gift →"}</Button>
      </form>
      <p className="gate-footer">A little surprise, just for you ♡</p>
    </main>
  );
}

function Welcome({ next }: { next: () => void }) {
  return <Frame scene={1}><section className="center">
    <Eyebrow>October 11 · A day for you</Eyebrow>
    <h1>Today, we celebrate Diya.</h1>
    <p className="lede">A little reminder of how beautiful it is to have you in this world.</p>
    <Button onClick={next}>Enter her little world →</Button>
    <p className="whisper">Some days are special. Today is one of them.</p>
  </section></Frame>;
}

function Meet({ next, back, open }: { next: () => void; back: () => void; open: () => void }) {
  return <Frame scene={2} onBack={back}><section className="meet">
    <button className="hero-photo" onClick={open} aria-label="Open portrait">
      <img src={photos[0].src} alt={photos[0].alt} />
      <span>Portrait placeholder · click to view</span>
    </button>
    <div>
      <Eyebrow>A soul worth celebrating</Eyebrow>
      <h1>Meet our beautiful Diya.</h1>
      <p className="lede">A smile that brightens a room. A heart that makes the people around her feel at home.</p>
      <p>There is something wonderful about the way you make ordinary moments feel a little more special.</p>
      <Button onClick={next}>Discover her story →</Button>
    </div>
  </section></Frame>;
}

function Gallery({ next, back, open }: { next: () => void; back: () => void; open: (n: number) => void }) {
  return <Frame scene={3} onBack={back}><section className="gallery">
    <header><Eyebrow>Little moments, forever memories</Eyebrow><h1>Little moments, a thousand reasons to smile.</h1><p>Every photograph holds a little piece of a moment worth keeping.</p></header>
    <div className="photo-grid">{photos.map((photo, i) => <button className="photo-card" key={photo.title} onClick={() => open(i)}>
      <img src={photo.src} alt={photo.alt} /><strong>{photo.title}</strong><span>{photo.note}</span>
    </button>)}</div>
    <Button onClick={next}>Continue our little story →</Button>
  </section></Frame>;
}

const qualities = [
  ["♡", "Her kind heart", "The way she cares, notices the little things and makes people feel important."],
  ["☼", "Her laughter", "The moments when her happiness fills the room and makes everyone smile too."],
  ["❀", "Her own beautiful way", "The little details that make her uniquely herself, impossible to replace."],
];

function Qualities({ next, back }: { next: () => void; back: () => void }) {
  return <Frame scene={4} onBack={back}><section className="qualities">
    <header><Eyebrow>More than a pretty picture</Eyebrow><h1>The little things that make you, you.</h1><p>Some things are too beautiful to fit inside a photograph.</p></header>
    <div className="quality-grid">{qualities.map(([icon, title, text], i) => <article key={title} className={`quality q-${i}`}>
      <span className="quality-icon">{icon}</span><h2>{title}</h2><p>{text}</p>
    </article>)}</div>
    <Button onClick={next}>Hear from your family →</Button>
  </section></Frame>;
}

const familyVideos = [
  { name: "Father", label: "With Papa", src: "public/videos/father.mov" },
  { name: "Mother", label: "With Mumma", src: "public/videos/mother.mp4" },
  { name: "Sister", label: "With Haya", src: "public/videos/sister.mp4" },
];

function FamilyVideos({ next, back }: { next: () => void; back: () => void }) {
  return <Frame scene={5} onBack={back}><section className="family-videos">
    <header>
      <Eyebrow>Voices from home</Eyebrow>
      <h1>Three little messages, with so much love.</h1>
      <p>Press play whenever you're ready. These wishes are yours to keep.</p>
    </header>
    <div className="video-grid">
      {familyVideos.map((video) => <article className="video-card" key={video.name}>
        <div className="video-frame">
          <video controls preload="metadata" aria-label={`${video.name}'s birthday message`}>
            <source src={video.src} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>
        <Eyebrow>{video.name}</Eyebrow>
        <h2>{video.label}</h2>
      </article>)}
    </div>
    <Button onClick={next}>Make a birthday wish →</Button>
  </section></Frame>;
}

function BirthdayCard({ next, back }: { next: () => void; back: () => void }) {
  const [open, setOpen] = useState(false);
  return <Frame scene={6} onBack={back}><section className={`wish ${open ? "is-open" : ""}`}>
    <header><Eyebrow>A little wish for your new year</Eyebrow><h1>{open ? "A wish, especially for you." : "There's a little wish waiting for you."}</h1></header>
    <div className="birthday-card">
      {open && <div className="celebration" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}
      </div>}
      {!open ? <div className="closed-card"><Leaf /><span className="seal">D</span><p>October 11</p></div> : <div className="letter">
        <p>My dearest Diya,</p><h2>Happy Birthday! ♡</h2>
        <p>May this new year of your life bring you the kind of happiness that stays, the kind of love that makes you feel safe, and the kind of memories that make you smile long after the moment has passed.</p>
        <p>May you always have reasons to laugh, people who celebrate you, courage to follow your dreams, and little moments that remind you how special you are.</p>
        <p>Keep being yourself. Keep growing, keep dreaming, and never forget that you deserve beautiful things in life.</p>
        <p>May your birthday be filled with warmth, laughter, surprises and everything that makes your heart happy.</p>
        <p>Wishing you the most beautiful birthday, Diya.</p><p className="signoff">With love, always ♡</p>
      </div>}
    </div>
    {!open ? <Button onClick={() => setOpen(true)}>Open your birthday wish ♡</Button> : <Button onClick={next}>One last little thing →</Button>}
  </section></Frame>;
}

function Final({ replay, back }: { replay: () => void; back: () => void }) {
  return <Frame scene={7} onBack={back}><section className="final">
    <Eyebrow>And before you go…</Eyebrow><h1>May life always be gentle with you.</h1>
    <div className="final-copy">
      <p>May you find happiness in the little things, strength in the difficult moments, and people who remind you how wonderful you are.</p>
      <p>May this next chapter bring new adventures, beautiful opportunities and memories that you will treasure for years.</p>
      <p>Today is your day, Diya. Celebrate yourself, smile a little more, and make a wish that is entirely your own.</p>
    </div>
    <h2>Happy Birthday, Diya.</h2><p className="signature">Made with love, especially for you ♡</p>
    <Button onClick={replay} secondary>Read it all again</Button>
  </section></Frame>;
}

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [scene, setScene] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const player = new Audio("/media/diya-theme.mp4");
    player.loop = true;
    player.preload = "auto";
    audioRef.current = player;

    return () => {
      player.pause();
      audioRef.current = null;
    };
  }, []);

    async function unlockAndPlayMusic() {
    const player = audioRef.current;

    // Start playback directly from the password submission interaction.
    if (player) {
      try {
        await player.play();
      } catch (error) {
        console.error("Could not start birthday music:", error);
      }
    }

    setUnlocked(true);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [scene]);
  useEffect(() => {
    if (!unlocked) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(null);
      if (lightbox !== null) return;
      if (event.key === "ArrowRight") setScene((current) => Math.min(7, current + 1));
      if (event.key === "ArrowLeft") setScene((current) => Math.max(1, current - 1));
    }
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [unlocked, lightbox]);
  if (!unlocked) {
  return <PasswordGate onUnlock={unlockAndPlayMusic} />;
  }

  const props = { next: () => setScene((s) => Math.min(7, s + 1)), back: () => setScene((s) => Math.max(1, s - 1)) };
  return <>
    <MusicControl audioRef={audioRef} />
    {scene === 1 && <Welcome next={props.next} />}
    {scene === 2 && <Meet {...props} open={() => setLightbox(0)} />}
    {scene === 3 && <Gallery {...props} open={setLightbox} />}
    {scene === 4 && <Qualities {...props} />}
    {scene === 5 && <FamilyVideos {...props} />}
    {scene === 6 && <BirthdayCard {...props} />}
    {scene === 7 && <Final back={props.back} replay={() => setScene(1)} />}
    {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Portrait preview" onClick={() => setLightbox(null)}>
      <button onClick={() => setLightbox(null)} aria-label="Close portrait">×</button>
      <figure onClick={(e) => e.stopPropagation()}><img src={photos[lightbox].src} alt={photos[lightbox].alt} /><figcaption><strong>{photos[lightbox].title}</strong><span>{photos[lightbox].note}</span></figcaption></figure>
    </div>}
  </>;
}

export default App;
