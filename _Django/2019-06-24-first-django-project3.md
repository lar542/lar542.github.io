---
layout: post
title: Django Relation - 리뷰 등록, 삭제
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 리뷰 등록, 삭제
* 리뷰 등록 폼을 나타낼 모델 폼을 작성한다.

```python
# third/forms.py
from django import forms
from . models import Restaurant, Review

# 평점의 선택지
REVIEW_POINT_CHOICES = (
    ('1', 1),
    ('2', 2),
    ('3', 3),
    ('4', 4),
    ('5', 5),
)


class ReviewForm(ModelForm):
    class Meta:
        model = Review
        fields = ['point', 'comment', 'restaurant']
        labels = {
            'point': _('평점'),
            'comment': _('코멘트'),
        }
        widgets = {
            'restaurant': forms.HiddenInput(),  # 리뷰를 달 식당 정보는 사용자에게 보여지지 않도록 한다
            'point': forms.Select(choices=REVIEW_POINT_CHOICES)  # 선택지를 인자로 전달
        }
        help_texts = {
            'point': _('평점을 입력해주세요.'),
            'comment': _('코멘트를 입력해주세요.'),
        }
```

* 식당 상세화면 메소드에서 리뷰 목록을 조회하도록 수정하고 리뷰를 등록하는 view 메소드와 리뷰를 삭제하는 view 메소드를 추가한다.
* HttpResponseRedirect 대신 shortcuts의 redirect을 사용하여 코드를 줄일 수 있다.

```python
# third/view.py
from django.shortcuts import render, get_object_or_404, redirect
from . models import Restaurant, Review
from . forms import RestaurantForm, ReviewForm

def detail(request, id): # 식당 조회 페이지
    if 'id' is not None:
        item = get_object_or_404(Restaurant, pk=id)
        reviews = Review.objects.filter(restaurant=item).all() # 식당에 해당하는 리뷰을 조회
        return render(request, 'third/detail.html', {'item': item, 'reviews': reviews})
    return HttpResponseRedirect('/third/list/')

def review_create(request, restaurant_id):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            new_item = form.save()
        # HttpResponseRedirect을 사용하면 url을 다 써주어야하고, 만약 url이 변경되었을 때 함께 수정해주어야 하는 번거로움이 있음
        # shortcuts의 redirct를 사용하면 url 기반이 아니라 urls.py에 정의한 view name 기반으로 움직이기 때문에
        # url이 변경되더라고 view name이 그대로라면 변경하지 않아도 된다.
        return redirect('restaurant-detail', id=restaurant_id)
    item = get_object_or_404(Restaurant, pk=restaurant_id)
    form = ReviewForm(initial={'restaurant': item})
    return render(request, 'third/review_create.html', {'form': form, 'item': item})

def review_delete(request, restaurant_id, review_id):
    item = get_object_or_404(Review, pk=review_id)
    item.delete()
    return redirect('restaurant-detail', id=restaurant_id)
```

* url을 연결한다.

```python
# third/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list, name="list"),
    path('create/', views.create, name="restaurant-create"),
    path('update/', views.update, name="restaurant-update"),
    path('delete/', views.delete, name="restaurant-delete"),

    path('restaurant/<int:id>/', views.detail, name="restaurant-detail"),
    path('restaurant/<int:restaurant_id>/review/create/', views.review_create, name='review-create'),
    path('restaurant/<int:restaurant_id>/review/delete/<int:review_id>', views.review_delete, name='review-delete')
]
```

* 리뷰 등록 템플릿을 추가한다.

```html
<!-- third/templates/third/review_create.html -->
{% raw %}{% extends 'third/base.html' %}
{% load static %}
{% block content %}
<div class="container">
    <form action="{% url 'review-create' restaurant_id=item.id %}" method="post" style="margin-top:20px;">
        {% csrf_token %}
        <table>
            {{ form.as_table }}
        </table>
        <button type="submit">등록</button>
    </form>
</div>
{% endblock %}{% endraw %}
```

* 식당 상세화면에 리뷰쓰기 링크와 리뷰 목록을 추가한다.

```html
<!-- third/templates/third/detail.html -->{% raw %}
{% extends 'third/base.html' %}
{% load static %}
{% block content %}
<div class="container">
    <div class="row">
        <div class="col-sm-12" style="margin-top:20px;">
            <h3>{{ item.name }}</h3>
            <p>{{ item.address }}</p>
            <p>
                <a href="{% url 'restaurant-delete' %}?id={{ item.id }}">
                    <button class="btn btn-danger">삭제하기</button>
                </a>
            </p>
            <hr>
            <p>
                <a href="{% url 'review-create' restaurant_id=item.id %}">
                    <button class="btn btn-info">리뷰쓰기</button>
                </a>
            </p>
            {% for review in reviews %}
                <div class="card bg-light mb-3">
                    <div class="card-header"><b>{{ review.point }}</b>점
                        <a href="{% url 'review-delete' restaurant_id=item.id review_id=review.id %}">
                            <button type="button" class="close" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </div>
                    <div class="card-body">
                        <p class="card-text">{{ review.comment }}</p>
                    </div>
                </div>
            {% endfor %}
        </div>
    </div>
</div>
{% endblock %}{% endraw %}
```
![맛집 상세화면](/img/post_img/first-django-project-third-detail.png)