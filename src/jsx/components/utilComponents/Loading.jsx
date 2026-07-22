const Dots = () => (
  <div className="nova-loading-dots">
    <span />
    <span />
    <span />
  </div>
);

// fullscreen: route-level loading (auth check, lazy pages) — covers the viewport.
// default (inline): loading inside a card/section — no overlay, just centered dots.
const Loading = ({ fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div id="preloader">
        <Dots />
      </div>
    );
  }

  return (
    <div className="nova-loading-inline">
      <Dots />
    </div>
  );
};

export default Loading;
