---
layout: post
title: Django ORM - Column(Field) Lookup으로 복잡한 조건 검색
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### Column(Field) Lookup
* filter, exclude, get 메소드 내에서 검색을 원하는 필드명과 field looup을 붙여서 검색한다.
* {% raw %}{field명}__{조건 키워드(loopup type)}{% endraw %}

#### conrains : 특정 키워드가 포함된 레코드 조회

```python
>>> Restaurant.objects.filter(name__contains='Korea').values()
```

#### exact : 특정 키워드와 정확하게 일치하는 레코드 조회

```python
>>> Restaurant.objects.filter(name__contains='Korean Food').values()
>>> Restaurant.objects.filter(name='Korean Food').values() # 이렇게 검색하는 것과 같은 결과
```

#### gt, gte, lt, lte : 크거나, 크거나, 작거나, 작거나 같거나한 레코드 조회
* 해당 날짜 이전 데이터 조회, 해당 날짜 이후 데이터 조회

```python
>>> Restaurant.objects.filter(created_at__lt='2018-01-01 00:00:00').values()
>>> Restaurant.objects.filter(created_at__gt='2018-01-01 00:00:00').values()
```

#### startswith, endswith : 특정 문자열로 시작하거나 종료되는 레코드 조회

```python
>>> Restaurant.objects.filter(name__startswith='Korea').values()
>>> Restaurant.objects.filter(name__endswith='Food').values()
```

#### in : 여러 값을 한 번에 검색 조건으로 사용하여 레코드 조회

```python
>>> Restaurant.objects.filter(id__in=[1,3]).values()
```

#### range : 특정 값 사이의 레코드를 조회(between의 의미)

```python
>>> Restaurant.objects.filter(id__range=(1,3)).values()

>>> import datetime
>>> start_date = datetime.datetime(2018,12,3,0,0,0)
>>> end_date = datetime.datetime(2018,12,8,0,0,0)
>>> Restaurant.objects.filter(created_at__range=(start_date, end_date)).values()
```

* 그 외의 다양한 조건은 [장고 문서](https://docs.djangoproject.com/en/2.1/ref/models/querysets/#id4)를 확인하자.