# DIYA — A little world made for you

A responsive, six-scene birthday album built with React, Vite, and Tailwind CSS. The password screen appears before the birthday experience.

## Change the photos

Open `src/App.tsx` and find the `photos` array at the top of the file. Replace each `src` URL with Diya's photo path:

```ts
src: "/photos/diya-hero.jpg"
```

Place the image files in a new `public/photos/` folder. The first image is used for both **Meet Diya** and the first gallery card. Update each `alt`, `title`, and `note` in the same array if needed.

Recommended image format: JPG or WebP, portrait orientation, at least 1200 × 1500 px. The current Unsplash images are temporary placeholders and should be replaced before sharing.

## Change the music

1. Create `public/media/` if it does not exist.
2. Add your licensed or royalty-free music as `public/media/diya-theme.mp3`.
3. To use another filename, update this line in `src/App.tsx`:

```ts
audio.current = new Audio("/media/diya-theme.mp3");
```

Music does not autoplay. Diya must select the music button after entering. The player loops continuously and does not restart between scenes.

## Add the family videos

Create a `public/videos/` folder and add these three MP4 files:

- `father.mp4`
- `mother.mp4`
- `sister.mp4`

The **Family wishes** scene will load them automatically. Portrait-format videos work best, but landscape videos are also supported and will be cropped neatly inside their cards. To change names, labels, or filenames, edit the `familyVideos` array in `src/App.tsx`.

## Password and production security

The local preview accepts `111006` so the prototype can be played. **Do not deploy the preview fallback as private-content security.**

For production, create a server-side authentication endpoint that:

- compares the password on the server (store it in a server secret, never in client code);
- rate-limits failed attempts;
- returns a secure, `HttpOnly`, `SameSite` session cookie;
- protects private photo/audio routes as well as the page;
- returns HTTP 200 only after successful authentication.

Then set `VITE_AUTH_ENDPOINT` to that endpoint URL when building. The app sends `{ "password": "..." }` by POST with credentials enabled. Remove the local fallback in `PasswordGate` before a public deployment.

## Run and build

The Figma Make development server is already running. For a production check:

```bash
pnpm build
```
