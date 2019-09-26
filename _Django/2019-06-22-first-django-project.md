---
layout: post
title: Django CRUD - 리스트 조회
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 리스트 조회
* view 메소드에 목록 조회 코드를 추가한다.

```python
# third/views.py
from django.shortcuts import render
from . models import Restaurant

def list(request):
    context = {
        "restaurants": Restaurant.objects.all()
    }
    return render(request, 'third/list.html', context)
```

* 맛집 리스트를 예쁘게 조회하기 위해 [부트스트랩 CSS 라이브러리](https://getbootstrap.com/docs/4.1/getting-started/introduction/)를 적용해보자.
* 상단 메뉴(Navbar)는 공통 템플릿(base.html)로 빼둔다.

```html
<!-- templates/third/base.html -->
{% raw %}{% load static %}
<html>
<head>
    <meta charset="UTF-8">
    <title>음식점</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" href="{% static 'third/style.css' %}">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/third/list">음식점</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/third/list">리스트</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/third/create">등록</a>
          </li>
        </ul>
      </div>
    </nav>
    {% block content %}
    {% endblock %}
</body>
</html>{% endraw %}
```

* 마지막으로 리스트를 조회할 몸통(list.html)을 작성한다.

```html
<!-- templates/third/list.html -->
{% raw %}{% extends 'third/base.html' %}
{% load static %}
{% block content %}
<div class="container">
    {% for item in restaurants %}
    <div class="row restaurant-item" style="margin:20px auto;">
        <div class="col-sm-12">
            <div class="card border-secondary">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{ item.address }}</h6>
                    <p class="card-text">음식점의 설명이 들어갑니다.</p>
                    <a href="#" class="card-link">자세히 보기</a>
                    <a href="#" class="card-link">수정하기</a>
                </div>
            </div>
        </div>
    </div>
    {% endfor %}
</div>
{% endblock %}{% endraw %}
```
![맛집 리스트](/img/post_img/first-django-project-third-list.png)