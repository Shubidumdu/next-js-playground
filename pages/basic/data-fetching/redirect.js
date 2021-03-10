function Props({ posts, id, parasCount }) {
	return <div>이 페이지는 나타나지 않고, 바로 리다이렉팅됩니다.</div>;
}

export async function getStaticProps() {
	return {
		props: {},
		// permanent 속성에 대해서는 아래를 참조
		// https://developer.mozilla.org/ko/docs/Web/HTTP/Redirections#%EC%98%81%EC%86%8D%EC%A0%81%EC%9D%B8_%EB%A6%AC%EB%8B%A4%EC%9D%B4%EB%A0%89%EC%85%98
		redirect: { destination: '/', permanent: false },
	};
}

export default Props;
