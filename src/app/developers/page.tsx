import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Define the DeveloperCard component
interface DeveloperCardProps {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  funnyFact: string;
}

function DeveloperCard({ name, role, description, imageUrl, funnyFact }: DeveloperCardProps) {
  return (
    <Card className="w-[350px] m-4">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          <strong>Fun Fact:</strong> {funnyFact}
        </p>
      </CardContent>
    </Card>
  );
}

// Main App component
export default function App() {
  const developers = [
    {
      name: "ChatGPT",
      role: "AI Language Model",
      description: "I can write code, debug, and even tell you a joke (sometimes).",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
      funnyFact: "I once wrote a poem about a bug in a recursive function.",
    },
    {
      name: "Claude",
      role: "AI Assistant",
      description: "I'm great at summarizing text and helping you brainstorm ideas.",
      imageUrl: "https://www.anthropic.com/images/claude-logo.png",
      funnyFact: "I once summarized a 10,000-word essay into 'TL;DR: Life is short.'",
    },
    {
      name: "Gemini",
      role: "AI Multimodal Model",
      description: "I can process text, images, and even audio. Jack of all trades!",
      imageUrl: "https://www.gemini.com/images/logo.png",
      funnyFact: "I once mistook a picture of a cat for a loaf of bread. Multimodal struggles.",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center p-8">
      {developers.map((dev) => (
        <DeveloperCard
          key={dev.name}
          name={dev.name}
          role={dev.role}
          description={dev.description}
          imageUrl={dev.imageUrl}
          funnyFact={dev.funnyFact}
        />
      ))}
    </div>
  );
}