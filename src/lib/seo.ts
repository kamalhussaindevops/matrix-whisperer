import type { Metadata } from "next";

const baseUrl = "https://thematrix-destiny.netlify.app";
const siteName = "DestinyMatrix";
const defaultImage = `${baseUrl}/og/default-og.jpg`;

export function buildMetadata(input: {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  const url = `${baseUrl}${input.path}`;
  const image = input.image ?? defaultImage;

  return {
    metadataBase: new URL(baseUrl),
    title: input.title,
    description: input.description,
    keywords: input.keywords.join(", "),
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
      url,
      type: input.type ?? "website",
      siteName,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
      site: "@destinymatrix",
    },
  };
}

export { baseUrl };
