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
	return {
		paths: [
			{
				// 아래는 /1/2/catch-all 로 매칭됩니다.
				params: {
					catchAll: ['1', '2', 'catch-all'],
				},
			},
		],
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const [id, parasCount, _] = params.catchAll;
	const res = await fetch(
		`https://baconipsum.com/api/?type=all-meat&paras=${parasCount}&start-with-lorem=${id}`,
	);
	const posts = await res.json();

	return {
		props: {
			posts,
			id: id,
			parasCount: parasCount,
		},
	};
}

export default Props;
