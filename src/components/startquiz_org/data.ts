export type Player = { id: string; name: string; score: number; emoji: string };
export type Option = {
  id: string;
  label: string;
  color: "red" | "orange" | "blue" | "green";
};

export const samplePlayers: Player[] = [
  { id: "1", name: "Dada", score: 315, emoji: "👩🏻‍🎓" },
  { id: "2", name: "Bobo", score: 300, emoji: "👱🏼‍♀️" },
  { id: "3", name: "Titi", score: 158, emoji: "🧒🏽" },
  { id: "4", name: "Jira", score: 154, emoji: "🧑🏾‍🎓" },
];

export const sampleQuizzes = [
  {
    title: "Math Fundamental",
    level: "Easy" as const,
    questions: 15,
    duration: "30 min",
  },
  {
    title: "Computer Programming",
    level: "Hard" as const,
    questions: 25,
    duration: "1 hour",
  },
  {
    title: "Science Essentials",
    level: "Medium" as const,
    questions: 20,
    duration: "45 min",
  },
  {
    title: "Math Fundamental",
    level: "Easy" as const,
    questions: 15,
    duration: "30 min",
  },
];

export const options: Option[] = [
  { id: "a", label: "HyperText Make Language", color: "red" },
  { id: "b", label: "HyperText Markup Language", color: "orange" },
  { id: "c", label: "HybridText Market Language", color: "blue" },
  { id: "d", label: "Hyperlink Type Make Language", color: "green" },
];
