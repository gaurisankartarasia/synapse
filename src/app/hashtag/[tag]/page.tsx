import HashtagPage from "./component";

export default function Page({ params }: { params: { tag: string } }) {
  return <HashtagPage />;
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  return {
    title: `#${params.tag} - Posts`,
    description: `Posts tagged with #${params.tag}`
  };
}