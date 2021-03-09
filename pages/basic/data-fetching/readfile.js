import { promises as fs } from 'fs';
import path from 'path';

// 아래의 `posts`는 빌드 시점에 `getStaticProps`에 의해 정해진다.
function Images({ posts }) {
	return (
		<ul>
			{posts.map(({ filename, content }) => (
				<li>
					<h3>{filename}</h3>
					<img src={`data:image;base64,${content}`} />
				</li>
			))}
		</ul>
	);
}

// 아래의 함수는 빌드 시점에 서버 사이드에서 호출된다.
// 즉, 클라이언트와는 아무런 관련이 없으며, 따라서 심지어는 직접 DB 쿼리를 해도 된다.
export async function getStaticProps() {
	// process.cwd()는 해당 프로젝트가 실행되는 위치를 의미하며, 따라서 루트 폴더가 된다.
	const postsDirectory = path.join(process.cwd(), 'testFiles');
	const filenames = await fs.readdir(postsDirectory);

	// 루트의 testFiles 폴더 내에 위치한 이미지 파일들을 base64로 인코딩하여 가져온다
	const posts = filenames.map(async (filename) => {
		const filePath = path.join(postsDirectory, filename);
		const fileContents = await fs.readFile(filePath, { encoding: 'base64' });
		return {
			filename,
			content: fileContents,
		};
	});

	return {
		props: {
			// 위에서 처리한 `posts`는 Promise[]이다.
			posts: await Promise.all(posts),
		},
	};
}

export default Images;
