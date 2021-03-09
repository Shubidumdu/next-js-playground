`getStaticProps`는 다음과 같은 파라미터와 반환 객체를 갖는다.

```js
export async function getStaticProps({
	params,
	preview,
	previewData,
	locale,
	locales,
	defaultLocale,
}: context) {
	return {
		props: {},
		revalidate: 1,
		notFound: false,
		redirect: {
			destination: '/',
			permanent: false,
		},
	};
}
```

## context

context 각각의 프로퍼티는 다음과 같다.

- `params` : 다이나믹 라우트에 사용되는 페이지들을 위한 라우트 파라미터들을 갖는다. 예를 들어, `[id].js`가 페이지명이라면, `params`는 `{ id: ... }`과 같은 형태가 된다. 추후에 설명될 `getStaticPaths`와 같이 사용된다.
- `preview` : 페이지가 프리뷰 모드라면 `true`이고, 아니라면 `undefined`가 된다.
- `previewData` : `setPreviewData`에 의해 설정된 프리뷰 데이터들을 담고 있다.
- `locale` : 현재 활성화된 지역을 의미한다. (이용 가능할 시)
- `locales` : 모든 지원가능 지역들을 의미한다. (이용 가능할 시)
- `defaultLocale` : 기본 설정 지역을 의미한다. (이용 가능할 시)

## return

반환 객체는 다음의 프로퍼티들을 가질 수 있다.

- `props` : 페이지 컴포넌트에 전달되는 객체로, **필수**값이다.
- `revalidate` : 요청이 일어날 시에 페이지 재생성이 일어날 수 있는 시간(초 단위)를 의미하며, **선택**값이다.
- `notFound` : 404 상태와 페이지를 반환할지의 여부에 대한 값이며, **선택**값이다.
- `redirect` : `{destination: string, permanent: boolean}`의 형태를 가지며, 페이지를 리다이렉팅 시킨다.

## 기술적 디테일 (Technical details)

기술적으로, `getStaticProps`는 다음과 같은 특징을 갖는다.

### **빌드 시점에만 실행된다.**

`getStaticProps`는 빌드 시점에 실행되기 때문에, 요청 시점에만 이용 가능한 데이터를 가져올 수 없다. 이를테면 쿼리 파라미터나 HTTP 헤더 정보 등이 그렇다.

### **직접적인 서버사이드 코드만 작성한다.**

`getStaticProps`는 서버사이드에서만 실행된다. 이는 절대 클라이언트 사이드에서 실행될 수 없다. 마찬가지로 JS 번들 내에 포함되지도 않는다. 덕분에 직접적인 DB 쿼리를 작성해도 된다.

### **HTML과 JSON 모두 정적으로 생성된다.**

`getStaticProps`를 가진 페이지는 빌드 시점에 사전 렌더링(pre-rendering)된다. 또한 HTML과 더불어 `getStaticProps` 실행의 결과로 JSON 파일을 생성해낸다.

이 JSON 파일은 `next/link`나 `next/router`를 통해 클라이언트측 라우팅에 활용된다. `getStaticProps`를 통해 사전 렌더링된 페이지에 접근하려 할 때, NextJS는 아까 미리 생성된 JSON 파일을 가져와서 페이지 컴포넌트의 props로 전달한다. 다시 말해, 클라이언트 측의 페이지 전환은 **이미 만들어진 JSON을 사용하는 것이지, `getStaticProps`를 다시 호출하는 것이 아니다.**

### **오직 페이지 내에서만 쓸수 있다.**

`getStaticProps`는 페이지 파일 내에서만 export 될 수 있다. 페이지 파일이 아닌 경우는 그럴 수 없다.

이런 제약이 있는 이유는 바로 React가 페이지 렌더링 이전에 필요한 데이터들을 모두 가져와야 하기 때문이다.

또한, 반드시 `export async function getStaticProps() {}`의 형태를 써야한다. 만약 단순히 페이지 컴포넌트의 프로퍼티로 `getStaticProps`를 추가한다면 이는 동작하지 않는다.

### **development 모드에서는 매 요청마다 실행된다.**

`next dev`를 통해 dev 모드로 프로젝트가 동작하고 있을 때, `getStaticProps`는 매 요청마다 새로 실행된다.

### **Preview Mode**

일부 경우에, 이러한 정적인 페이지 생성을 무시하고, 빌드 시점이 아닌 매 요청마다 페이지를 렌더링하고 싶을 수도 있다.

이 경우 **Preview Mode**라고 불리는 NextJS의 지원 기능을 사용할 수 있는데, 자세한 사항에 대해서는 따로 설명하도록 하겠다.
