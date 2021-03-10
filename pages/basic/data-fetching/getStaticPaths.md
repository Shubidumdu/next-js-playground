# getStaticPaths

만약 페이지가 동적 라우팅을 갖고 `getStaticProps`를 사용한다면, 빌드 시점에 어떤 path들에 대해서 HTML을 렌더링해야하는지에 대해 정의를 해주어야 한다.

동적 라우팅을 사용하는 해당 페이지에서 `getStaticPaths`라는 이름의 `async` 함수를 export 한다면, NextJS는 해당 함수에서 정의된 모든 path들에 대해 정적으로 사전 렌더링 작업을 수행한다.

```js
export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } } // See the "paths" section below
    ],
    fallback: true or false // See the "fallback" section below
  };
}
```

## `paths` key (필수)

`paths` key는 사전 렌더링을 거칠 path들을 정의한다.

예를 들어, `pages/posts/[id].js`라는 이름으로 동적 라우팅을 사용하는 페이지를 갖고있다면, 해당 페이지로부터 `getStaticPaths`를 export하고 다음과 같은 형태로 `paths`를 반환해야한다.

```js
return {
  paths: [
    { params: { id: '1' } },
    { params: { id: '2' } }
  ],
  fallback: ...
}
```

위의 예시라면, `posts/1`과 `/posts/2` path에 대해 빌드 시점에 `pages/posts/[id].js` 내의 페이지 컴포넌트를 생성한다.

각각의 `params`는 **작성된 페이지 파일의 파라미터와 반드시 일치해야 한다는 점을 유의하자.**

- 만약 페이지명이 `pages/posts/[postId]/[commentId]`라면, `params`는 반드시 `postId`와 `commentId`를 포함해야 한다.
- 만약 페이지명이 catch-all 라우트를 사용한다면, 다시 말해 `pages/[...slug]`와 같은 형태라면, `params`는 반드시 `slug` 배열을 포함해야한다.
  > 예를 들어, `['foo', 'bar']`과 같은 형태로 배열을 지정한다면 NextJS는 `/foo/bar` path에 대해 페이지를 생성한다.
- 만약 페이지가 optional catch-all 라우트를 사용한다면, `null`, `[]`, `undefined` 혹은 `false` 값을 루트 최단 경로에 사용하라.
  > 예를 들어, `pages/[[...slug]]`의 경우에 `params`에 `slug: false`를 포함한다면, NextJS는 정적으로 `/` 페이지를 생성한다.

## `fallback` key (필수)

`fallback`은 boolean 값으로, 반드시 포함되어야 한다.

### `fallback: false`인 경우

`fallback`이 `false`라면, `getStaticPaths`에 의해 반환되지 않은 path에 대해서는 404 페이지를 반환하게 된다.

주로 다음의 경우에 유용하다.

1. 사전 렌더링 해야하는 path 수 자체가 적을 때 (전부 정적 생성을 해도 부담이 없을 때)
2. 새로운 페이지가 거의 추가 되지 않을 때
   > 반대로 말하면, 새로운 페이지가 추가될 때마다 새로 빌드를 해야한다.

아래는 `pages/posts/[id].js` 페이지에 대한 예시이다. `getStaticPaths`와 `getStaticProps`를 적절히 활용해서 CMS로부터 데이터를 가져와서 사용한다.

```js
function Post({ post }) {
	// Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
	// Call an external API endpoint to get posts
	const res = await fetch('https://.../posts');
	const posts = await res.json();

	// Get the paths we want to pre-render based on posts
	const paths = posts.map((post) => ({
		params: { id: post.id },
	}));

	// We'll pre-render only these paths at build time.
	// { fallback: false } means other routes should 404.
	return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
	// params contains the post `id`.
	// If the route is like /posts/1, then params.id is 1
	const res = await fetch(`https://.../posts/${params.id}`);
	const post = await res.json();

	// Pass post data to the page via props
	return { props: { post } };
}

export default Post;
```

### `fallback: true`

`fallback`이 `true`라면, `getStaticProps`의 동작이 다음과 같아진다.

- `getStaticPaths`에서 반환되는 path들은 `getStaticProps`에 의해 빌드 시점에 HTML에 렌더링된다.
- 위 과정에서 렌더링하지 않은 path들에 대해서도 404 페이지를 띄우지 않는다. 대신, 이러한 path에 대한 최초 요청 시 페이지의 'fallback' 버전을 제공한다.
- 내부적으로는, NextJS이 요청받은 path에 대한 HTML과 JSON을 정적으로 생성하며, 이는 `getStaticProps`를 실행하는 것 역시 포함한다.
- 바로 위의 작업이 끝나면, 브라우저가 생성된 path에 대해 JSON을 가져오고, props와 함께 해당 페이지를 자동으로 렌더링한다. 이용자 입장에서 볼 때는, 해당 페이지가 fallback 페이지에서 완전한 페이지로 전환된다.
- 동시에, NextJS는 해당 path를 사전 렌더링 페이지의 리스트에 추가한다. 이제 동일한 path에 대해 다시 요청이 들어오면, 위 과정에서 생성한 페이지를 다시 제공하며, 이는 빌드 시점에 만든 페이지를 제공하는 것과 동일하다.

### Fallback Pages

페이지의 "fallback" 버전은 다음과 같은 특성을 지닌다.

- `props`가 비어있다.
- `router`를 사용해서, `fallback`이 렌더링된 상태인지를 감지할 수 있다. (`router.isFallback`: boolean)

아래는 하나의 예시다.

```js
// pages/posts/[id].js
import { useRouter } from 'next/router';

function Post({ post }) {
	const router = useRouter();

	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	// Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
	return {
		// Only `/posts/1` and `/posts/2` are generated at build time
		paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
		// Enable statically generating additional pages
		// For example: `/posts/3`
		fallback: true,
	};
}

// This also gets called at build time
export async function getStaticProps({ params }) {
	// params contains the post `id`.
	// If the route is like /posts/1, then params.id is 1
	const res = await fetch(`https://.../posts/${params.id}`);
	const post = await res.json();

	// Pass post data to the page via props
	return {
		props: { post },
		// Re-generate the post at most once per second
		// if a request comes in
		revalidate: 1,
	};
}

export default Post;
```
