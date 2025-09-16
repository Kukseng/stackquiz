// import Choice from "@/components/startquiz_org/Choice";

import Choice from "@/components/startquiz_org/Choice";

// export default function Page() {
//   return <Choice />;
// }



export default function Page() {
  const options = [
    { id: 1, text: "Option 1", color: "#e63946", icon: "circle" },
    { id: 2, text: "Option 2", color: "#ff9f1c", icon: "triangle" },
    { id: 3, text: "Option 3", color: "#118ab2", icon: "square" },
    { id: 4, text: "Option 4", color: "#06d6a0", icon: "diamond", correct: true },
  ];

  return <Choice options={options} />;
}
