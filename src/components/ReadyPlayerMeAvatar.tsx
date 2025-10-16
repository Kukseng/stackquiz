// // src/components/ReadyPlayerMeAvatar.jsx

// "use client"
// import React, { useEffect } from "react";

// export default function ReadyPlayerMeAvatar() {
//   useEffect(() => {
//     const iframe = document.getElementById("rpm-frame");

//     // Listen for messages from the Ready Player Me editor
//     window.addEventListener("message", (event) => {
//       if (event.origin !== "https://readyplayer.me") return;

//       // When avatar is exported
//       if (event.data?.source === "readyplayerme" && event.data.eventName === "v1.avatar.exported") {
//         console.log("Avatar URL:", event.data.data.url);
//       }

//       // Subscribe to all events after frame loads
//       if (event.data?.eventName === "v1.frame.ready") {
//         (iframe as HTMLIFrameElement).contentWindow?.postMessage(
//           JSON.stringify({
//             target: "readyplayerme",
//             type: "subscribe",
//             eventName: "v1.avatar.exported",
//           }),
//           "https://readyplayer.me"
//         );
//       }
//     });
//   }, []);

//   return (
//     <iframe
//       id="rpm-frame"
//       title="Ready Player Me Avatar Creator"
//       src="https://readyplayer.me/avatar?frameApi"
//       allow="camera *; microphone *; clipboard-write"
//       style={{
//         width: "100%",
//         height: "600px",
//         border: "none",
//         borderRadius: "1rem",
//         overflow: "hidden",
//       }}
//     />
//   );
// }
