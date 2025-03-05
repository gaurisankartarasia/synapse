import HashtagPage from "./component";

export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return <HashtagPage tag={tag} />;
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return {
    title: `#${tag} - Posts`,
    description: `Posts tagged with #${tag}`,
  };
}
