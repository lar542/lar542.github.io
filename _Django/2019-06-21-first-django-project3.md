---
layout: post
title: Django ORM - 페이징
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 페이징
* QuerySet은 리스트 형태로 가져오기 때문에 슬라이싱으로 특정 개수까지 조회할 수 있다.

```
>>> Restaurant.objects.all()[0:1]
```

* 역순으로 조회하여 슬라이싱한 후 데이터 확인

```
>>> Restaurant.objects.order_by('-created_at')[1:3].values()
```