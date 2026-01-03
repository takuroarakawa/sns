import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function RightSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-80 flex-shrink-0 py-4 pl-4 hidden xl:block">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-10 rounded-full bg-muted border-none"
          />
        </div>

        {/* Trending Section */}
        <div className="rounded-xl bg-muted p-4">
          <h2 className="text-xl font-bold mb-4">Trending</h2>
          <div className="space-y-4">
            <TrendingItem
              category="Science"
              topic="Quantum Computing"
              posts={1234}
            />
            <TrendingItem
              category="Manga"
              topic="One Piece Chapter 1100"
              posts={5678}
            />
            <TrendingItem
              category="Art"
              topic="Digital Illustration"
              posts={890}
            />
            <TrendingItem
              category="Research"
              topic="AI Ethics"
              posts={2345}
            />
          </div>
        </div>

        {/* Who to Follow */}
        <div className="rounded-xl bg-muted p-4">
          <h2 className="text-xl font-bold mb-4">Who to follow</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Suggestions will appear here once you start following people.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-xs text-muted-foreground space-x-2">
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Cookies</a>
          <span>© 2024 SNS Platform</span>
        </div>
      </div>
    </aside>
  );
}

function TrendingItem({
  category,
  topic,
  posts,
}: {
  category: string;
  topic: string;
  posts: number;
}) {
  return (
    <div className="cursor-pointer hover:bg-background/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
      <p className="text-xs text-muted-foreground">{category}</p>
      <p className="font-semibold">{topic}</p>
      <p className="text-xs text-muted-foreground">
        {posts.toLocaleString()} posts
      </p>
    </div>
  );
}
