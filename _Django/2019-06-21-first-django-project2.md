---
layout: post
title: Django ORM - 데이터 조회, 데이터 필터링
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 데이터 조회
* third 웹 앱에 맛집 사이트를 만들어보자.
* 레스토랑 정보를 나타내는 Restaurant 모델을 작성한다.

```python
# third/models.py
from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=30)
    address = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
```

* 데이터베이스에 모델을 추가한다.

```
python manage.py makemigrations
python manage.py migrate
```

* 파이썬 쉘로 변경하고 레스토랑 정보를 추가한다.

```python
python manage.py shell

>>> from third.models import Resrtaurant
>>> Restaurant(name="Deli Shop", address="Gangnam").save()
>>> Restaurant(name="Korean Food", address="Gangbuk").save()
>>> Restaurant(name="Sushi", address="Gangbuk").save()
```

* values 메소드는 가져온 데이터를 확인할 수 있다.

```python
>>> Restaurant.objects.all().values()
<QuerySet [{'id': 1, 'name': 'Deli Shop', 'address': 'Gangnam', 'created_at': datetime.datetime(2019, 6, 21, 4, 43, 15, 438672, t
zinfo=<UTC>), 'update_at': datetime.datetime(2019, 6, 21, 4, 43, 15, 439672, tzinfo=<UTC>)}, {'id': 2, 'name': 'Korean Food', 'ad
dress': 'Gangbuk', 'created_at': datetime.datetime(2019, 6, 21, 4, 43, 35, 554506, tzinfo=<UTC>), 'update_at': datetime.datetime(
2019, 6, 21, 4, 43, 35, 554506, tzinfo=<UTC>)}, {'id': 3, 'name': 'Sushi', 'address': 'Gangbuk', 'created_at': datetime.datetime(
2019, 6, 21, 4, 43, 48, 674725, tzinfo=<UTC>), 'update_at': datetime.datetime(2019, 6, 21, 4, 43, 48, 674725, tzinfo=<UTC>)}]>
```

* 하나의 오브젝트를 선택하고 싶으면 primary key 기준으로 get 메소드를 사용한다.

```python
>>> Restaurant.objects.get(pk=1).name
>>> Restaurant.objects.get(pk=2).address
>>> item = Restaurant.objects.get(pk=3)
>>> item.name
```

* order_by 메소드로 정렬 순서를 바꿀 수 있다.
* 역순으로 바꾸려면 '-'를 붙인다.
* 최신순, 이름순

```python
>>> Restaurant.objects.order_by('-created_at').values()
>>> Restaurant.objects.order_by('name').values()
```

### 데이터 필터링
* 원하는 데이터만 조회하도록 필터링할 수 있는 메소드인 filter, exclude를 사용할 수 있다.
* filter : 조건에 해당하는 데이터만 조회
* exclude : 해당 조건을 가진 데이터만 제외하여 조회

```python
>>> Restaurant.objects.filter(name='Deli Shop').values()
>>> Restaurant.objects.exclude(name='Sushi').values()
```

* 이들이 리턴하는 QuerySet은 실제 데이터를 읽기 전까지 데이터베이스에서 실행되지 않기 때문에 chaining이 가능하다.

```python
>>> Restaurant.objects.all()
>>> Restaurant.objects.all().values() # 이 시점에 쿼리 실행

>>> query = Restaurant.objects.exclude(name='Sushi')
>>> query = query.exclude(address='Gangnam')
>>> query.values() # 이 시점에 쿼리 실행

# filter 메소드를 chaining
>>> Restaurant.objects.filter(address='Gangbuk').filter(name='Korean Food') 
```