function Post({ posts }) {
	return (
		<div>
			{posts.map((post, idx) => (
				<div key={idx} style={{ margin: '1rem' }}>
					{post}
				</div>
			))}
		</div>
	);
}

export async function getServerSideProps(context) {
	const res = await fetch(`https://baconipsum.com/api/?type=meat-and-filler`);
	const posts = await res.json();
	// 서버 측 콘솔을 통해 context의 값을 확인해보자.
	console.log(context);

	return {
		props: {
			posts,
		},
	};
}

export default Post;
