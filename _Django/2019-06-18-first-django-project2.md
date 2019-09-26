---
layout: post
title: Django - 구현한 모델 클래스를 테이블로 생성하는 명령어
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.


장고에서는 구현한 모델 클래스를 데이터베이스의 실제 테이블로 자동 생성하는 명령어를 제공한다. 모델 클래스가 수정될 때마다 아래의 명령어를 사용해야 한다.
* makemigrations : models.py에 작성했던 모델 클래스가 모델링되어 migrations/0001_initial.py로 생성된다.
    * 0001_initial.py의 fields에 추가하지 않은 id가 생성되어있는 데 이는 자동으로 만들어지는 PK를 의미한다.
* migrate : 구조에 맞는 테이블이 생성되며 db.sqlite3라는 파일이 생성된다. 이 파일이 데이터베이스의 역할을 하게 된다.

```python
python manage.py makemigrations
python manage.py migrate
```