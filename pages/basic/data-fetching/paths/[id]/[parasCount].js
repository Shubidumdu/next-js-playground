function Props({ posts, id, parasCount }) {
	return (
		<div>
			<div style={{ margin: '1rem' }}>{id}번째 포스트입니다.</div>
			<div style={{ margin: '1rem' }}>문단은 {parasCount}개 입니다.</div>
			{posts.map((post, idx) => (
				<div key={idx} style={{ margin: '1rem' }}>
					{post}
				</div>
			))}
		</div>
	);
}

export async function getStaticPaths() {
	// 각각 아래의 params에 해당하지 않는 경우에는 404 페이지를 출력합니다.
	return {
		paths: [
			{
				params: {
					id: '1',
					parasCount: '3',
				},
			},
			{
				params: {
					id: '3',
					parasCount: '5',
				},
			},
		],
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const res = await fetch(
		`https://baconipsum.com/api/?type=all-meat&paras=${params.parasCount}&start-with-lorem=${params.id}`,
	);
	const posts = await res.json();

	return {
		props: {
			posts,
			id: params.id,
			parasCount: params.parasCount,
		},
	};
}

export default Props;
