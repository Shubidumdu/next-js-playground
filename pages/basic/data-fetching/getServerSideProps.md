# getServerSideProps (SSR)

`getServerSideProps`라는 이름의 `async` 함수를 export한다면 NextJS는 해당 페이지를 `getServerSideProps`에 의해 반환된 데이터를 통해 서버사이드렌더링을 한다.

```js
export async function getServerSideProps({
	params,
	req,
	res,
	query,
	preview,
	previewData,
	resolvedUrl,
	locale,
	locales,
	defaultLocale,
}: context) {
	return {
		props: {}, // will be passed to the page component as props
		notFound: boolean,
	};
}
```

위에서 `context` 파라미터는 아래의 프로퍼티들을 갖는다.

- `params` - 동적 라우팅을 사용하는 페이지일 경우, `params`를 갖는다.
- `req` - [HTTP IncomingMessage 객체](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
- `res` - [HTTP response 객체](https://nodejs.org/api/http.html#http_class_http_serverresponse)
- `query` - 쿼리스트링을 나타내는 객체
- `preview` - 페이지가 프리뷰 모드라면 `preview`가 `true`다.
- `previewData` - `setPreviewData`에 의해 설정된 프리뷰 데이터
- `resolvedUrl` - 정규화된 버전의 요청 URL이다.
- `locale`, `locales`, `defaultLocale` - `getStaticProps`의 그것들과 동일하다.

`getServerSideProps`는 다음의 프로퍼티를 가진 객체를 반환해야 한다.

- `props` - 필수 객체로, 페이지 컴포넌트에 전달될 `props`를 나타낸다.
- `notFound` - 선택 boolean값으로, `true`라면 404 페이지와 status를 반환한다.
- `redirect` - `{ destination: string, permanent: boolean }`

아래는 `getServerSideProps`를 이용한 간단한 SSR 예시다.

```js
function Page({ data }) {
	// Render data...
}

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API
	const res = await fetch(`https://.../data`);
	const data = await res.json();

	// Pass data to the page via props
	return { props: { data } };
}

export default Page;
```

## `getServerSideProps`는 언제 써야할까?

**요청 시점에** 데이터를 가져와서 사전 렌더링을 해야할 필요가 있을 때에 `getServerSideProps`를 쓰면 좋다. 이는 TTFB(Time to first byte)가 `getStaticProps`보다 느린데, 서버가 매 요청마다 결과를 계산해서 반환해야 하기 때문이다. 또한 그 결과는 별도로 추가적인 설정이 없는 한 CDN을 통해 **캐싱될 수 없다.**

만약 데이터를 사전 렌더링할 필요가 없다면, 클라이언트 사이드에서 데이터를 가져오는 것에 대해서도 고려해보자. 이에 대해선 아래에서 설명한다.

## TypeScript

TS에서는 아래와 같이 사용한다.

```ts
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
	// ...
};
```

```TS
import { InferGetServerSidePropsType } from 'next'

type Data = { ... }

export const getServerSideProps = async () => {
  const res = await fetch('https://.../data')
  const data: Data = await res.json()

  return {
    props: {
      data,
    },
  }
}

function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // will resolve posts to type Data
}

export default Page
```

## Technical details

### 오직 서버사이드에서만 실행된다.

`getServerSideProps`는 오직 서버사이드에서만 실행되고, 절대 브라우저 안에서 실행되지 않는다.

다시 말해, 어떤 페이지가 `getServerSideProps`를 사용한다면 :

- 해당 페이지를 요청했을 때, `getServerSideProps`가 **요청 시점에** 실행되며, 이후 반환된 props를 통해 사전렌더링된 페이지로 응답한다.
- `next/link` 또는 `next/router`를 통해 해당 페이지에서 전환을 요청한다면, NextJS는 서버에 API 요청을 전달하며, 이는 `getServerSideProps`를 실행한다. 그 결과로 JSON을 반환받고, 이를 통해 페이지를 렌더링한다. 이러한 과정은 모두 NextJS를 통해 자동으로 처리되며, 그저 `getServerSideProps`를 쓰고 있는 한, 추가적으로 필요한 작업은 없다.

### 오직 페이지 파일에서만 허용된다.

`getServerSideProps`는 오직 페이지 파일에서만 export 될 수 있다.
또한, 반드시 `export async function getServerSideProps() {}`와 같은 형태로 사용해야 한다. 페이지 컴포넌트에 `getServerSideProps`를 프로퍼티로 추가하는 방식으로는 동작하지 않는다.
