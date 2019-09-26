---
layout: post
title: Django Relation - 릴레이션 모델 선언
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### Relation
* 모델과 모델 사이의 관계를 말하며, 다음과 같은 종류가 있다.
    1. Many-to-Many : 하나의 출판사에서 여러 저작물을 낼 수 있고, 하나의 저작물이 여러 출판사에서 낼 수 있다.
    2. Many-to-One : 게시물 한 개에 여러 개의 댓글이 달린다.
    3. One-to-One : 한 사람은 하나의 여권만 가질 수 있다.

### 릴레이션 모델 선언
* Restaurant와 1대 다 관계를 가진 Review 모델을 선언해보자.
* 기존의 Restaurant 모델 아래에 Review 모델을 작성한다.
* models.ForeignKey : Restaurant 모델의 ForeignKey로 선언한다. 실제 데이터베이스에 Restaurant의 pk인 id 값을 저장하는 컬럼(restaurant_id)가 Review에 추가된다.
* on_delete : 연관된 Restaurant이 삭제될 때 이에 의존한 Review들을 어떻게 처리할 건지에 대한 설정
    * CASCADE : 모든 댓글 삭제
    * SET_NULL : restaurant 속성을 NULL로 처리
    * SET_DEFAULT : restaurant 속성을 기본 값으로 업데이트
    * DO_NOTHING : 아무 조치도 하지 않는다.

```python
# third/models.py
class Review(models.Model):
    point = models.IntegerField()
    comment = models.CharField(max_length=500)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
```