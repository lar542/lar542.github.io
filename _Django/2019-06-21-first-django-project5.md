---
layout: post
title: Django ORM - 데이터 수정, 삭제
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 데이터 수정
* 수정할 데이터를 가져온 후 속성 값을 변경하고 save를 호출하면 수정이 완료된다.

```python
>>> item = Restaurant.objects.get(pk=1)
>>> item.name 
'Deli Shop'
>>> item.name = 'My Shop'
>>> item.save()
```

* save를 호출할 때 insert인지 update인지 구분하는 기준은 모델의 인스턴스에 id(pk)값의 유무에 따른다. 

```python
>>> import datetime
>>> new_item = Restaurant(name='My Shop 2', address='Yeoksam')
>>> new_item
<Restaurant: Restaurant object (None)>
>>> new_item.id = 1 # id를 1로 지정하면 기존에 있는 id가 1인 레코드의 해당 속성 값이 변경된다.
>>> new_item.save() # update가 이루어 진다.
```

### 데이터 삭제
* 조회한 레코드에 delete 메소드를 호출한다.

```python
>>> item = Restaurant.objects.get(pk=1)
>>> item.delete()
(1, {'third.Restaurant': 1})
```