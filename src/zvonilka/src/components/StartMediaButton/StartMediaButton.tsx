import {
  useRoomContext,
  useStartAudio,
  useStartVideo,
} from "@livekit/components-react";
import React from "react";

export interface StartMediaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

/**
 * The `StartMediaButton` component is only visible when the browser blocks media playback.
 * This is due to some browser implemented autoplay policies.
 * To start media playback, the user must perform a user-initiated event such as clicking this button.
 * As soon as media playback starts, the button hides itself again.
 */
export const StartMediaButton = React.forwardRef<
  HTMLButtonElement,
  StartMediaButtonProps
>(function StartMediaButton({ label, ...props }: StartMediaButtonProps, ref) {
  const room = useRoomContext();
  const { mergedProps: audioProps, canPlayAudio } = useStartAudio({
    room,
    props,
  });
  const { mergedProps, canPlayVideo } = useStartVideo({
    room,
    props: audioProps,
  });
  const { style, ...restProps } = mergedProps;
  style.display = canPlayAudio && canPlayVideo ? "none" : "block";

  return (
    <button ref={ref} style={style} {...restProps}>
      {label ?? `Start ${!canPlayAudio ? "Audio" : "Video"}`}
    </button>
  );
});
