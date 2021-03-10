import { useRouter } from 'next/router';

function Post({ posts, id }) {
	const router = useRouter();

	// 만약 한번도 해당 요청을 받은 적이 없다면 아래의 로딩 페이지를 렌더링합니다.
	// 이후 데이터를 가져옵니다.
	if (router.isFallback) {
		return <div>로딩 중입니다...</div>;
	}

	// 데이터를 가져왔거나, 이미 요청을 받은 적이 있는 페이지라면 아래를 렌더링합니다.
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
	// fallback이 true입니다.
	// 덕분에 paths에 반환하는 params가 아무것도 없어도 페이지를 띄우는데 문제가 없습니다.
	return {
		paths: [],
		fallback: true,
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
