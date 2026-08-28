import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function LoadingAnimation({
  text = "Loading...",
}) {
  return (
    <div className="raritone-loading">

      <DotLottieReact
        src="/animations/loading.lottie"
        loop
        autoplay
      />

      <p>
        {text}
      </p>

    </div>
  );
}

export default LoadingAnimation;