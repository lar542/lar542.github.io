---
layout: post
title: JavaScript 기본, 헷갈린 것
tags: [JavaScript]
bigimg: /img/title_img/201909.jpg
---

* 크롬 개발자도구 console에서 줄바꿈하려면 Shift + Enter
* 변수명은 camelCase로 만드는 것이 규칙
* 이스케이핑

```javascript
var str = "\"오른쪽에 있는 것은 문자열로 인식한다!\""
```
* undefined / null : 둘 다 빈 값인데 차이가 있다.
	* undefined : 변수 선언 후 값을 집어넣지 않았을 때 자동으로 undefined(정해지지 않음)가 된다.
	* null : 빈 값을 의도적으로 넣는다. 그냥 넣는 게 아니라 기존에 있는 값을 지울 때 사용한다.
	
```javascript
var a; //자동으로 undefined
a; //undefined

var b = 123;
b = null;
b; //null
```

* 객체의 속성명
    * 문자열만 가능
    * 따옴표로 감싸도 되고 안해도 되고
    * 띄어쓰기가 들어간 속성명이면 따옴표로 감싸야함
        * 띄어쓰기가 들어갔기 때문에 호출할 때는 `객체명['속성명']` 방식으로 호출
* 객체의 속성을 삭제하는 방법은 앞에 `delete` 키워드를 붙이면 된다.
    * delete 객체명.속성명
* 객체 리터럴 : new Object()를 사용하지 않고 `{}`를 사용해서 만든 객체
* 리터럴 : new String(), new Number()와 같이 new를 사용하지 않고 만든 것
* 배열 리터럴 : new Array()를 사용하지 않고 `[]`를 사용해서 만든 배열
* 배열 안에는 객체 리터럴처럼 무엇이든 들어간다.
    * 값, 배열, 객체, 함수
* 배열의 길이를 미리 정할 필요가 없다.
* 함수 선언과 함수 표현식의 차이는 호이스팅 현상과 끝에 세미콜론(;) 여부

```javascript
//함수 선언
function addOne(x){
    var y = x + 1;
    return y
}

//함수 표현식
var addOne = function(x) {
    var y = x + 1;
    return y;
};
```
* 사실 모든 함수는 return을 입력하지 않으면 자동으로 `return undefined;`가 마지막 코드로써 동작한다.
* 메소드 : 객체의 속성 값으로 사용되는 함수.
* 1급 함수 : 자바스크립트에서는 함수도 값으로 사용할 수 있다. 즉, 함수도 인자 값과 매개변수로써 사용될 수 있다.

```javascript
var mother = function(func) {
  func();
};
var children = function() {
  alert('안녕하세요');
};
mother(children);
```

* 나눗셈(/)은 다른 언어처럼 몫을 나타내는 것이 아니라 그냥 나눈 값을 나타낸다. (5 / 2 == 2.5)
* -, *, /는 문자열로 표현된 숫자도 계산해준다.
* 논리연산자는 true, false를 연산하는 게 아니라, 참인 값과 거짓인 값들을 연산한다.
* 거짓인 값 : '', 0 , -0, false, NaN, undefinde, null, document.all
    * `false == []` 이지만 `if([])`는 true로 나타내므로 실행된다.
* 논리연산자는 코드를 줄일 때 자주 사용한다. - `Syntactic Sugar`

```javascript
var j = k && l; 
//k 값이 존재한다면 l값도 검사하기 때문에 j는 l이 된다.
//하지만 k 값이 없으면 k && l이 false이기 때문에 l값은 검사하지도 않으므로 j는 undefined가 된다.
var m = n || p;
//n 값이 존재한다면 n || p이 true가 되므로 p는 검사하지도 않고 m은 n이 된다.
//하지만 n 값이 없으면 p를 검사해서 m은 p가 된다.
```
* ==으로 비교연산을 하면 자동으로 자료형을 바꿔버리고 값만 비교하기 때문에 자바스크립트에서 같은 값인지 비교할 때는 반드시 자료형까지 비교하는 `===`을 사용하자. 다른지 비교할 때는 `!==`

```javascript
0 == '' //true
0 == false //true
0 == [] //true

0 === '' // false
0 === false // false
0 === [] // false
```
