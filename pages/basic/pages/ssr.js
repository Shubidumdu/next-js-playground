function Page({ posts }) {
  return (
    <div>
      <div style={{ margin: "1rem" }}>
        아래는 getServerSideProps()를 통해 fetch해온 데이터입니다. <br />
        getServerSideProps는 getStaticProps와 거의 동일하지만, 빌드 시점에 미리
        페이지를 만들지 않고, 매 요청마다 페이지를 만들어냅니다. <br />
        때문에, 매번 새로운 페이지를 만들기 때문에 캐싱이 적용되지 않는다는
        문제가 있으나, 항상 업데이트된 페이지를 제공할 수 있습니다.
      </div>
      {posts.map((post, idx) => (
        <div style={{ margin: "1rem" }} key={idx}>
          {idx}: {post}
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://baconipsum.com/api/?type=meat-and-filler");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}

export default Page;
