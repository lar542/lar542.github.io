---
layout: post
title: Django - 파이썬 쉘에서 장고 모델로 데이터 생성 및 저장, 데이터 출력
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 장고 모델로 데이터 생성 및 저장
* Pycharm의 터미널을 파이썬 쉘로 실행시킨다.

```python
python manage.py shell
```

* Post를 생성하고 이를 저장한다.
    * post를 조회하면 Post object가 생성된 걸 확인할 수 있다.
    * db.sqlite3에서 this is title을 찾을 수 있다.

```python
>>> from second.models import Post
>>> post = Post.objects.create(title='this is title', content='this is content')
>>> post
<Post: Post object (1)>
>>> post.save()
```

* 모든 Post 오브젝트를 가져와서 방금 생성한 하나를 조회해본다.

```python
>>> posts = Post.objects.all()
>>> posts
<QuerySet [<Post: Post object (1)>]>
>>> posts[0].title
'this is title'
```

### 저장된 데이터 출력
* 위에서 저장한 10건을 조회한다.
* views.py에 모든 Post를 가져오는 메소드를 추가한다.

```python
# second/views.py
from django.shortcuts import render
from second.models import Post

def list(request):
    context = {
        'items': Post.objects.all()
    }
    return render(request, 'second/list.html', context)
```

* list.html에 모든 레코드를 조회하는 for 구문을 작성한다.

```html
<!-- second/templates/second/list.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>second</title>
</head>
<body>
    {% raw %}{% for item in items %}
    <div>
        <h4>
            {{ item.title }}
        </h4>
        <p>{{ item.content }}</p>
    </div>
    {% endfor %}{% endraw %}
</body>
</html>
```

* urls.py에 url를 추가한다.

```python
# second/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list, name="list")
]
```

* http://127.0.0.1:8000/second/list/ 로 접속하여 확인할 수 있다.