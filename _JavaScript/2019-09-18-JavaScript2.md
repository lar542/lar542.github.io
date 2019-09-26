---
layout: post
title: BOM
tags: [JavaScript]
bigimg: /img/title_img/201909.jpg
---

### BOM
* navigator : 브라우저나 운영체제에 대한 정보가 있다. userAgent 정보를 바탕으로 고객에 대한 정보를 분석할 수 있다. 브라우저에 따라 다른 동작을 해야하거나 IE 브라우저인지 체크해야할 때 사용한다.

```javascript
navigator.userAgent; //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36
navigator.language; //ko-KR
navigator.cookieEnabled; //true
navigator.vendor; //Google Inc.
```

* screen : 화면에 대한 정보를 알려준다. 화면 크기에 따라 다른 동작을 하고 싶을 때 사용한다. 너비(width), 높이(height), 픽셀(pixelDepth), 컬러(colorDepth), 화면 방향(orientation), 작업표시줄을 제외한 너비와 높이(availWidth, availHeight) 등이 있다.

```javascript
screen.availHeight; //1040
screen.availWidth; //1920
screen.colorDepth; //24
```

* location : 주소에 대한 정보를 알려준다.(protocol, host, hostname, pathname, href, port, search, hash 속성을 이용) `location.reload()`는 새로고침, `location.replace()`는 현재 주소를 다른 주소로 교체할 수 있다.

```javascript
location.host;
location.hostname;
location.protocol;
location.href;
location.pathname;
```

* history
    * history.forward() 또는 history.go(1) : 앞으로가기
    * history.back() 또는 history.go(-1) : 뒤로가기
    * history.go(페이지수) : 히스토리 간에 이동
    * history.length : 뒤로가기할 수 있는 페이지의 개수
    * HTML5에 추가
        * history.pushState(객체, 제목, 주소)
        * history.replaceState(객체, 제목, 주소)
        * 페이지를 이동하지 않고 단순히 주소만 바꿔준다. 객체 부분에 페이지에 대한 정보를 추가할 수 있다.
        * 싱글 페이지 어플리케이션을 만들 때 자주 사용된다. 페이지 깜박임 없이 주소를 바꾸고, 바뀐 주소에 따른 액션을 취할 때 사용된다.