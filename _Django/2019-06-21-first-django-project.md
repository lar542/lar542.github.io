---
layout: post
title: Django - ORM(Object Relational Mapping)
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### ORM(Object Relational Mapping)
* 객체지향 언어에서 서로 다른 시스템 간의 데이터 형식의 호환을 위해 데이터를 변환하고 매핑(연결)해주는 방식 또는 기술
* 여러 시스템에 사용가능한 개념이다.
* 예를 들어 sqlite3로 DB를 사용하다가 mysql로 변경하게 되도 코드는 거의 변경없이 사용할 수 있게 된다.
* 장고에서도 다른 웹 프레임워크와 유사하게 ORM을 제공하고 있으며, 기본적으로 하나의 모델 클래스에 하나의 테이블로 연동이 된다. 사용할 모든 모델의 정보를 클래스로 기술하면 여러 테이블의 메타 데이터를 포함하고 있는 데이터베이스 스키마를 기술한 것이 된다.