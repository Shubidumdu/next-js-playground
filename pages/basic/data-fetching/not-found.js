function NotFound() {
	return <div>이 페이지는 보이지 않고, 무조건 404페이지가 뜨게 됩니다.</div>;
}

export async function getStaticProps() {
	return {
		notFound: true,
	};
}

export default NotFound;
