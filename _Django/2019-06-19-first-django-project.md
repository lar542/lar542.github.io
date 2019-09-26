---
layout: post
title: Django - MTV 패턴의 정의
subtitle: MTV 패턴, HTTP 요청과 응답의 흐름
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### MTV 패턴
* 웹 프로그램 개발 시 일반적으로 언급되는 패턴이 MVC(Model, View, Controller) 패턴이다.
* 이를 장고에서는 MTV(Model, Template, View) 패턴으로 바꿔서 정의한다.
* 장고에서의 Model은 MVC의 Model과 같은 의미를 가지지만, MVC의 View는 장고의 Template, MVC의 Controller는 장고의 View로 각각 역할이 나뉜다.
    * Template : 사용자에게 보여지는 화면으로 MVC의 View와 유사한 역할. templates/*.html
    * View : views.py에서 view 메소드를 정의하고 이 메소드가 데이터를 처리하여 그 결과를 template에 전달하기 때문에 MVC의 Controller와 유사한 역할.

### HTTP 요청과 응답의 흐름
1. 클라이언트가 특정 주소로 요청을 보낸다.
2. 장고 웹 앱에 요청이 들어온다.
3. url conf 모듈이 요청 url을 확인한다.
4. urls.py를 보고 url 처리를 담당하는 뷰 메소드를 결정한다.
5. views.py에서 메소드를 실행한다. 필요한 경우 모델을 통해 데이터를 처리한다.
6. 그 결과로 render 메소드로 template 기반의 html 코드를 생성한다.
7. 결과를 클라이언트로 전달한다.