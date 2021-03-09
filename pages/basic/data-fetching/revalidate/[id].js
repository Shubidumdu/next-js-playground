// 아래에서 revalidate를 활성화시킨 덕분에, 아래 포스팅은 1초당 한번씩 재검증된다.
// 다시 말해, 새로운 게시물이 추가되더라도, 따로 새롭게 빌드 및 배포할 필요가 없다.
function Props({ posts, id }) {
	return (
		<div>
			<div style={{ margin: '1rem' }}>{id}번째 포스트입니다.</div>
			{posts.map((post, idx) => (
				<div key={idx} style={{ margin: '1rem' }}>
					{post}
				</div>
			))}
		</div>
	);
}

// 이는 `fallback`과 완벽하게 호환된다.
// 왜냐하면 항상 최신의 게시물 목록을 가질 수 있기 때문에
// 새로운 게시물이 path에 포함되어 있지 않아도 적절한 결과를 보여주기 때문이다.
export async function getStaticPaths() {
	const paths = [1, 2, 3, 4, 5].map(
		(number) => `/basic/data-fetching/revalidate/${number}`,
	);
	return { paths, fallback: true };
}

// 기본적으로 아래 함수는 서버사이드에서 빌드 시점에 호출된다.
// 1) 헌데 만약 revalidation이 활성화되어 있고,
// 2) 그 상태에서 새로운 요청이 들어온다면
// 이는 여러번 호출될 수 있다.
export async function getStaticProps({ params }) {
	const res = await fetch(
		`https://baconipsum.com/api/?type=all-meat&paras=5&start-with-lorem=${params.id}`,
	);
	const posts = await res.json();

	return {
		props: {
			posts,
			id: params.id,
			// 1초마다 요청이 들어온다면 페이지를 재생성하려고 시도한다.
			revalidate: 1,
		},
	};
}

export default Props;
