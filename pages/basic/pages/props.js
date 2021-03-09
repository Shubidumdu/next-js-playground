function Page({ posts }) {
  return (
    <div>
      <div style={{ margin: "1rem" }}>
        아래는 getStaticProps()를 통해 fetch해온 데이터입니다.
      </div>
      {posts.map((post, idx) => (
        <div style={{ margin: "1rem" }} key={idx}>
          {idx}: {post}
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://baconipsum.com/api/?type=meat-and-filler");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}

export default Page;
