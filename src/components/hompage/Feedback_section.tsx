import { cn } from "@/components/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";

const reviews = [
  {
    name: "Dana",
    username: "@jack",
    body: "StackQuizz made our class more interactive than ever!",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Rita",
    username: "@jill",
    body: "I love competing with friends across different subjects.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Bora",
    username: "@john",
    body: "Easy to use and super fun for group activities.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Janny",
    username: "@jane",
    body: "This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jira",
    username: "@jenny",
    body: "Look so cool, need stackquiz to provice all skill.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "Neary",
    username: "@james",
    body: "This flatform is give me to funny study.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full py-12  w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-300 bg-transparent hover:bg-gray-800/10" // subtle hover
      )}
    >
      <div className="flex flex-row items-center  gap-2">
        <Image
          src={img}
          alt="photo profile feedback"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <figcaption className="text-white text-sm font-medium">
            {name}
          </figcaption>
          <p className="text-gray-400 text-xs font-medium">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-white text-sm">{body}</blockquote>
    </figure>
  );
};

export function FeedbackQuiz() {
  return (
    <div className="relative max-w-7xl mx-auto flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s] gap-4">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s] gap-4">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-blue-500/60 backdrop-blur-md"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-blue-500/60 backdrop-blur-md"></div> */}
    </div>
  );
}
