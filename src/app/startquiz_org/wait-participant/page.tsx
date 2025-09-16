// import WaitParticipant from "@/components/startquiz_org/WaitParticipant";
// export default function Page() {
//   return <WaitParticipant />;
// }

// ParentComponent.tsx
import WaitParticipant from "@/components/startquiz_org/WaitParticipant";

export default function ParentComponent() {
  const sessionId = "12345";       // From backend / created session
  const participantName = "Rotha"; // From user input

  return <WaitParticipant sessionId={sessionId} participantName={participantName} />;
}
