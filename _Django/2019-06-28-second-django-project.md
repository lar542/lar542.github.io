---
layout: post
title: URL namespace 설정
tags: [django]
bigimg: /img/title_img/201906.jpg
---

### URL namespace 설정
* 특정 템플릿에서 url의 view name으로 웹 앱의 urls.py를 참조한다. 이때, 다른 웹 앱의 view name과 중복되지 않기 위해 웹 앱 urls.py별로 namespace를 설정해준다.

```python
# 웹 앱/urls.py
from django.urls import path
from . import views

app_name = 'polls' # namespace

urlpatterns = [
    path('<int:question_id>/', views.detail, name='detail'),
]
```

* 템플릿에서 참조할 때는 다음과 같이 나타낸다.

```html
{% raw %}<a href="{% url 'polls:detail' question.id %}"></a>{% endraw %}
```