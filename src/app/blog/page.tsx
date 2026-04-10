import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogListing from "./BlogListing";
import { getAllBlogPosts } from "@/lib/getBlogPosts";

export const metadata = {
  title: "Destiny Matrix Blog | Guides and Insights",
  description: "Guides, insights, and deep dives into your destiny matrix chart — numerology, compatibility, forecasting, and spiritual growth.",
};

export default async function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div style={{ background: "#f8f9fc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <BlogListing posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
