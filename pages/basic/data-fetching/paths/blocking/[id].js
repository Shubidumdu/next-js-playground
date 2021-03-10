function Post({ posts, id }) {
	// 이는 서버사이드렌더링을 통해 반환됩니다.
	// 첫번째 이후의 요청에 대해서는 기존에 생성된 페이지를 반환합니다.
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

export async function getStaticPaths() {
	// fallback이 blocking입니다.
	// 덕분에 paths에 반환하는 params가 아무것도 없어도 페이지를 띄우는데 문제가 없습니다.
	return {
		paths: [],
		fallback: 'blocking',
	};
}

export async function getStaticProps({ params }) {
	// 위의 getStaticPaths에서 아무 paths를 반환하지 않았어도, 아래는 정상적으로 동작합니다.
	const id = params.id;

	const res = await fetch(
		`https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=${id}`,
	);
	const posts = await res.json();

	return {
		props: {
			posts,
			id,
		},
	};
}

export default Post;
