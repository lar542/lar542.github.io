---
layout: post
title: Window 객체
tags: [JavaScript]
bigimg: /img/title_img/201909.jpg
---

### window 객체
* 브라우저의 요소들과 자바스크립트 엔진, 모든 변수를 담고 있는 객체
* 모든 객체의 조상(전역 객체, 글로벌 객체)이기 때문에 window는 생략 가능
* 함수 안에 선언한 변수(지역 변수) 외에 선언한 변수도 window 객체 안에 등록된다. → 전역 변수
* window 아래에는 대표적으로 screen, location, history, document 객체, parseInt, isNaN 메소드가 있다. 
    * document 객체는 DOM이라고도 불린다.
    * 나머지는 브라우저에 대한 정보를 가지고 있어서 BOM(Browser object model)이라고 불린다.

### window 객체의 메소드
* window.close() : 현재 창을 닫는다. window는 생략 가능하지만 다른 함수와 헷갈릴 수 있으므로 window를 붙여준다.
* window.open(주소, 새 탭/현재 탭, 새 창의 설정) : 새 창을 연다.

```javascript
var popup = window.open('', '', 'width=200,height=200');
popup.document.write('안녕하세요'); //팝업창의 내용을 변경
popup.close(); //닫기
popup.opener.document.write('hello'); //팝업창에서 원래 탭에 접근할 수 있는 opener 객체
```

* window.encodeURI(), window.decodeURI() : 인코딩, 디코딩
* window.setTimeout(함수, 밀리초) : 지정한 초 뒤에 실행
* window.setInterval(함수, 밀리초) : 지정한 초마다 반복

```javascript
var timeout = setTimeout(function() {
  alert('1초 뒤');
}, 1000);

var interval = setInterval(function() {
  console.log('1초마다');
});

//중간에 멈추기
clearTimeout(timeout)
clearInterval(interval)
```

* window.getComputedStyle(태그) : 태그의 스타일을 찾는다. 현재 적용된 CSS 속성 값을 알 수 있다.

```javascript
console.log(getComputedStyle(document.getElementById('app-root')));
```