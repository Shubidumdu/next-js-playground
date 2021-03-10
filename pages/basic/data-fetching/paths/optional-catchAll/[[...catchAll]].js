function Props({ posts }) {
	return (
		<div>
			<div style={{ margin: '1rem' }}>
				이 페이지는 전달 받은 params가 없습니다.
			</div>
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
				// 아래는 / 로 매칭됩니다.
				// false 외에 `[]`, `null`, `undefined`를 반환해도 동일한 결과입니다.
				params: {
					catchAll: false,
				},
			},
		],
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	console.log(params);
	const res = await fetch(`https://baconipsum.com/api/?type=meat-and-filler`);
	const posts = await res.json();

	return {
		props: {
			posts,
		},
	};
}

export default Props;
