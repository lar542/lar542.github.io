---
layout: post
title: Django CRUD - 페이징 적용
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 페이징 적용
* view 메소드에 page 파라미터에 따라 리스트를 필터링하는 코드를 추가한다.

```python
# third/views.py
from django.shortcuts import render
from . models import Restaurant
from django.core.paginator import Paginator

def list(request):
    restaurants = Restaurant.objects.all()
    page = request.GET.get('page') # 파라미터로 넘어온 현재 페이지 값
    paginator = Paginator(restaurants, 5) # 한 페이지에 5개씩 표시
    items = paginator.get_page(page) # 해당 페이지에 맞는 리스트로 필터링
    context = {
        "restaurants": items
    }
    return render(request, 'third/list.html', context)
```

* 템플릿에 페이징을 위한 태그를 추가한다.
* has_previous : 이전 페이지의 존재 여부
* previous_page_number : 이전 페이지 숫자 값
* number : 현재 페이지 숫자 값
* has_next 다음 페이지의 존재 여부
* next_page_number : 다음 페이지 숫자 값
* paginator.num_pages : 총 페이지 개수

```html
<!-- templates/third/list.html -->
...{% raw %}
<div class="row">
    <div class="col-sm-12 text-center">
        <div class="pagination">
            <span class="step-links text-center" style="width:100%;">
                {% if restaurants.has_previous %}
                    <a href="?page=1">&laquo;</a>
                    <a href="?page={{ restaurants.previous_page_number }}">{{ restaurants.previous_page_number }}</a>
                {% endif %}

                <span class="current">
                    {{ restaurants.number }}
                </span>

                {% if restaurants.has_next %}
                    <a href="?page={{ restaurants.next_page_number }}">{{ restaurants.next_page_number }}</a>
                    <a href="?page={{ restaurants.paginator.num_pages }}">&raquo;</a>
                {% endif %}
            </span>
        </div>
    </div>
</div>
{% endraw %}...
```

* [페이지네이션에 대한 장고 문서](https://docs.djangoproject.com/ko/2.2/topics/pagination/)를 확인해보자.