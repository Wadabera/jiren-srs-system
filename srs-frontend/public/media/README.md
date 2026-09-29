# Optional hero video

The landing page hero always renders an animated canvas backdrop (drifting
aurora gradients + an interactive particle field). That works with no assets.

If you want real footage behind the hero instead, drop a video file here and it
is picked up automatically:

```
public/media/hero.mp4     (or hero.webm / hero.mov)
```

`HeroBackdrop.jsx` probes `/media/hero.mp4`, then `.webm`, then `.mov` with a
HEAD request on load. The first one that exists and reports a `video/*` content
type fades in over the canvas at 50% opacity, under the dark scrim so text
stays readable. If none exist, nothing breaks and the canvas is used alone.

## Practical notes

- **Keep it short and small.** 10-20 seconds, 720p, under ~8 MB. It loops, and
  anything larger is a lot of data for a decorative background.
- **Encode as H.264 MP4** for the widest support, ideally with a WebM VP9 copy
  too. Browsers reported `canPlayType('video/mp4') === 'maybe'` here, so mp4
  is safe.
- **Dark or neutral footage works best.** The scrim is fairly heavy on purpose
  for text contrast. Bright, busy clips will fight the headline.
- **No audio.** The element is `muted` and `playsInline`, which also lets it
  autoplay on mobile browsers that block unmuted video.
- **Respect reduced motion.** The canvas animation freezes when the OS asks for
  it. The video does not auto-pause; if you want that, add a
  `prefers-reduced-motion` check to the `<video>` in `HeroBackdrop.jsx`.

Good candidates: a slow pan across a classroom, students writing at desks, the
school gate, or a timelapse of the campus. Abstract or architectural footage
avoids needing consent for identifiable students.
