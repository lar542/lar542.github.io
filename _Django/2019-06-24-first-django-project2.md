---
layout: post
title: Django - url 패턴을 path parameter 형식으로 변경
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### query parameter를 path parameter 형식으로 변경
* query parameter 형식의 url 패턴을 path parameter 형식으로 수정해보자.
* urls.py에서 detail 화면을 path parameter 형식으로 수정하면 다음과 같다.

```python
# third/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list, name="list"),
    path('create/', views.create, name="restaurant-create"),
    path('update/', views.update, name="restaurant-update"),
    path('delete/', views.delete, name="restaurant-delete"),

    # path('detail/', views.detail, name="restaurant-detail"), query parameter
    path('restaurant/<int:id>/', views.detail, name="restaurant-detail"), # path parameter
]
```

* path parameter으로 수정하면 view 메소드에서 파라미터로 id를 받을 수 있고, id 값을 얻기 위해 request.GET.get을 사용하지 않아도 된다.

```python
# third/views.py
def detail(request, id): # path parameter로 선언하면 id를 받을 수 있음
    if 'id' is not None:
        # item = get_object_or_404(Restaurant, pk=request.GET.get('id'))
        item = get_object_or_404(Restaurant, pk=id)
        return render(request, 'third/detail.html', {'item': item})
    return HttpResponseRedirect('/third/list/')
```

* 마지막으로 자세히보기 링크를 다음과 같이 수정하면 된다.

```html
<!-- third/templates/third/list.html -->{% raw %}
<!-- <a href="{% url 'restaurant-detail' %}?id={{ item.id }}" class="card-link">자세히보기</a> -->
<a href="{% url 'restaurant-detail' id=item.id %}" class="card-link">자세히 보기</a>{% endraw %}
```
