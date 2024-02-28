import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { usePosts } from "./Components/PostContext";
import Test from "./Test";

// 1) Create a new Context

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);
  const { posts, onAddPost } = usePosts();

  const archiveOption = useMemo(() => {
    return {
      show: false,
      title: `Post archieve in addition to ${posts.length} main posts`,
    }
  }, [posts.length]);

  const handleAddPost = useCallback(function (post) {
    onAddPost(post);
  }, []);

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  return (
    // 2) Provide Value to Child Component

    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>

      <Header />
      <Main />
      <Archive archiveOption={archiveOption} onAddPost={handleAddPost} />
      <Footer />

    </section>

  );
}

function Header() {
  // 3) Consuming the context value
  const { onClearPosts } = usePosts();
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePosts();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = usePosts();
  return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
}

function Posts() {
  const { posts } = usePosts();
  return (
    <section>
      <List posts={posts} />
    </section>
  );
}

function FormAddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { onAddPost } = usePosts();

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List({ posts }) {
  return (
    <>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      {/* <Test /> */}
    </>
  );
}

const Archive = memo(function ({ archiveOption, onAddPost }) {

  const { createRandomPost } = usePosts();
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(archiveOption.show);

  return (
    <aside>
      <h2>{archiveOption.title}</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              {/* <button onClick={() => onAddPost(post)}>Add as new post</button> */}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
