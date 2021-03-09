function Props({ posts, id }) {
  return (
    <div>
      <div style={{ margin: "1rem" }}>{id}번째 포스트입니다.</div>
      {posts.map((post, idx) => (
        <div key={idx} style={{ margin: "1rem" }}>
          {post}
        </div>
      ))}
    </div>
  );
}

// getStaticPaths는 일종의 '가능한 path' 목록들을 반환합니다.
export async function getStaticPaths() {
  // fallback이 false라면 paths에 포함되지 않는 경로의 경우 404를 반환한다는 의미입니다.
  // 즉, params[id]가 1~5가 아닌 경우라면 404 페이지를 띄웁니다.
  const paths = [1, 2, 3, 4, 5].map((number) => `/basic/pages/posts/${number}`);
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log(params);
  // props에서 받아오는 params
  const res = await fetch(
    `https://baconipsum.com/api/?type=all-meat&paras=5&start-with-lorem=${params.id}`
  );
  const posts = await res.json();

  return {
    props: { posts, id: params.id },
  };
}

export default Props;
