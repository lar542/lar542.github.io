---
layout: post
title: Django - views.py와 urls.py, url 매핑 규칙, 템플릿, 스태틱 파일(정적 컨텐츠), 장고 템플릿의 블락(block)
subtitle: Django의 기본 구조
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### views.py와 urls.py
* views.py : 데이터를 처리하는 로직인 view 메소드를 정의하는 파일.

```python
# first/views.py
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello world")


def select(request):
    message = "수 하나를 입력해주세요."
    return HttpResponse(message)


def result(request):
    message = "추첨 결과입니다."
    return HttpResponse(message)
```

* urls.py : view 메소드를 연결하고 요청 url을 정의하는 파일. 도메인 이하를 path라고 하며, 어떤 화면으로 연결할 지 선언하는 것을 라우팅이라고 한다.
* path 함수의 첫 번째 인자는 클라이언트가 요청할 path를 말한다.
* url을 설정하고 views.py에서 정의한 view 메소드와 연결한다.

```python
# first/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('select/', views.select, name="select"),
    path('result/', views.result, name="result")
]
```

* 프로젝트 폴더의 공통 urls.py에 웹 앱의 url를 추가할 때마다 계속 추가하는 것은 번거로우므로 웹 앱별로 다른 ruls.py를 선언하고 프로젝트 폴더의 공통 urls.py에 해당 파일들을 포함하도록 만든다.
* 프로젝트 폴더에 웹 앱의 urls.py을 포함시킨다.

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('first.urls')),
    path('admin/', admin.site.urls),
]
```

### url 매핑 규칙
* query paramter : url의 ? 뒤의 파라미터
* path parameter : url 사이에 있는 파라미터. 파라미터 타입을 정의한다. 이 규칙의 예는 아래와 같다.
    * int : 정수형 숫자
    * str : 모든 문자열
    * slug : -(하이픈)이나 _(언더스코어)를 포함한 영숫자, 문자열

```python
path('calendar/<int:year>/<int:month>', views.calendar, name="calendar")
```

* urls.py에서 path parameter로 정의하면 view 메소드에서 해당 인자를 넘겨받을 수 있다.

```python
def calendar(request, year, month):
    message = str(year) + "년 " + str(month) + "월 입니다."
    return HttpResponse(message)
```

* 정규표현식을 사용해 url 패턴을 정의할 수 있다.
* 파라미터는 `P<name>pattern` 형태로 나타낸다.
* re_path 함수를 사용한다.

```python
# first/urls.py
from django.urls import path, re_path
from . import views

re_path(r'^articles/(?P<year>[0-9]{4})/$', views.year_archive, name="year_archive")
# articles로 시작하는 path에 year라는 파라미터를 보내는 데 이는 0부터 9사이의 4자리 숫자로 끝난다.
```
```python
# first/views.py
def year_archive(request, year):
    message = str(year) + "년 입니다!"
    return HttpResponse(message)
```

### 템플릿
* template의 loder로 템플릿 파일을 로드하고, 해당 템플릿에 전달할 데이터를 설정하여 render에 인자로 넘길 수 있다.

```python
# first/views.py
from django.template import loader
from datetime import datetime

def index(request):
    template = loader.get_template('index.html') # html 파일을 로딩
    now = datetime.now()
    context = {
        'current_date': now
    } # 템플릿에 전달할 데이터를 세팅할 수 있는 오브젝트
    return HttpResponse(template.render(context, request))
```

* 템플릿에서 넘어온 변수는 &#123;&#123;  &#125;&#125; 사이에 나타낸다.
* or 연산자로 나타내는 함수는 장고에 내장된 필터 함수이다. date 필터로 변수를 포매팅한다.

```html
<!-- first/templates/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>index html 페이지 입니다.</title>
</head>
<body>
    <p>변수를 표현해보자.</p>
    <p>{% raw %}{{ current_date }}{% endraw %}</p>
    <p>장고에 내장된 date 필터로 변수를 포매팅하자.</p>
    <p>{% raw %}{{ current_date|date:"Y년 m월 d일 H시 i분 s초" }}{% endraw %}</p>
</body>
</html>
```

* 템플릿 파일 인식을위해 first 웹 앱을 INSTALLED_APPS 리스트에 추가해야 한다.

```python
# firstdjango 프로젝트 폴더의 settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'first',
]

TIME_ZONE = 'Asia/Seoul' # 시간을 우리나라 시간으로 변경
```

#### 템플릿에서 웹 앱의 urls.py에 정의된 name을 참조

```html
<!-- first/templates/index.html -->
{% raw %}<a href="{% url 'select' %}">시작하기!</a>{% endraw %}
```
```python
# first/urls.py
path('select/', views.select, name="select")
```
#### shortcuts 모듈의 render 단축 메소드
* 기존의 template 모듈의 loader로 템플릿를 불러오고 render로 인자를 넘기는 부분을 shortcuts 모듈의 render라는 단축 메소드로 코드를 줄일 수 있다.

```python
# first/views.py
from django.shortcuts import render

def select(request):
    context = {"number": 4}
    return render(request, 'select.html', context)


def result(request):
    context = {'numbers': [1,2,3,4,5,6]}
    return render(request, 'result.html', context)
```

* select.html에 나머지 연산자를 사용할 수 없으므로 divisibleby 필터로 홀짝을 비교하는 if 템플릿 언어를 추가한다.

```html
<!-- select.html -->
<p>{% raw %}
    {% if number|divisibleby:2 %}
        짝수입니다.
    {% else %}
        홀수입니다.
    {% endif %}{% endraw %}
</p>
{% raw %}<a href="{% url 'result' %}">결과보기</a>{% endraw %}
```
* result.html에 리스트의 요소를 차례로 출력하는 for문을 추가한다.

```html
<!-- result.html -->
<ul>{% raw %}
    {% for num in numbers %}
    <li>{{ num }}</li>
    {% endfor %}{% endraw %}
</ul>
```

### 스태틱 파일(정적 컨텐츠)
* css, js, 이미지 파일 등을 말한다.
* 스태틱 파일의 위치는 기본적으로 웹 앱 폴더 하위의 static 폴더에 둔다.
* 프로젝트 폴더의 settings.py에서 스태틱 파일 위치, 즉 BASE_DIR를 static으로 추가한다.
* 이는 각 웹 앱의 하위에 있는 static 폴더 안의 스태틱 파일을 읽어온다는 것을 뜻한다.
* 단, 여러 웹 앱의 static 폴더 내에 같은 이름의 파일이 있는 경우 충돌이 발생할 수 있기 때문에 스태틱 파일 구조를 `static/웹 앱 폴더명/`으로 만들어야 한다.

```python
# 프로젝트 폴더 settings.py
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static")
]
```

* 마찬가지로 Template 파일도 충돌이 날 수 있으므로 `templates/웨 앱 폴더명/` 하위에 html 파일을 만들어야 한다.
* 폴더 구조가 바뀜에 따라 views.py의 템플릿명을 다음과 같이 수정한다.

```python
# first/views.py
...
def select(request):
    context = {"number": 4}
    return render(request, 'first/select.html', context)
...
```

* Template 파일에 추가한 이미지 파일을 불러온다. 
* 가장 상단에 load static을 추가해야 장고 스태틱 모듈을 불러올 수 있다.

```html
{% raw %}{% load static %}{% endraw %}
...
{% raw %}<img src="{% static 'first/thank-card.png' %}">{% endraw %}
```

### 장고 템플릿의 블락(block)
* 중복되는 코드만 따로 Template 파일로 만들어 코드를 재사용할 수 있다.
* 베이스 템플릿의 `block`과 `endblock` 사이에 중복되지 않는 코드가 들어가게 된다.
* 여기서 block의 이름을 content라고 지정한다.

```html
<!-- templates/first/base.html -->
{% raw %}{% load static %}
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>로또 번호 추첨</title>
    <link rel="stylesheet" type="text/css" href="{% static 'first/styles.css' %}">
</head>
<body>
    {% block content %}
    {% endblock %}
</body>
</html>{% endraw %}
```

* body 태그 내부를 제외한 코드는 중복되므로 나머지 템플릿 파일을 수정한다.
* 나머지 템플릿 파일의 첫 줄에 베이스 템플릿을 지정할 `extends` 구문을 선언하고 블록이 시작되는 위치를 `block` 구문으로 선언한다.

```html
<!-- templates/first/index.html  -->
{% raw %}{% extends 'first/base.html' %}
{% load static %}
{% block content %}
    <p>변수를 표현해보자.</p>
    <p>{{ current_date }}</p>
    <p>장고에 내장된 date 필터로 변수를 포매팅하자.</p>
    <p>{{ current_date|date:"Y년 m월 d일 H시 i분 s초" }}</p>

    <br>

    <a href="{% url 'select' %}">시작하기!</a>

    <br>

    <img src="{% static 'first/thank-card.png' %}">
{% endblock %}{% endraw %}
```
```html
<!-- templates/first/result.html -->
{% raw %}{% extends 'first/base.html' %}
{% load static %}
{% block content %}
    <h3>추첨 번호는 다음과 같습니다</h3>
    <ul>
        {% for num in numbers %}
        <li>{{ num }}</li>
        {% endfor %}
    </ul>
{% endblock %}{% endraw %}
```

* result.html에 입력한 숫자와 랜덤한 숫자를 받을 수 있도록 select.html와 views.py를 수정한다.

```html
<!-- templates/first/select.html -->
{% raw %}{% extends 'first/base.html' %}
{% block content %}
<p>수를 하나 입력해주세요.</p>

<form action="{% url 'result' %}" method="get">
    <input type="number" name="number">
    <button type="submit">결과보기</button>
</form>
{% endblock %}{% endraw %}
```

* get으로 넘긴 파라미터는 딕셔너리 형태로 담긴다.
* 숫자를 랜덤하게 섞기 위한 random 모듈을 사용한다.

```python
# first/views.py
import random

def result(request):
    # 요청 데이터가 딕셔너리 형태 담긴다
    # get이나 post로 넘어온 데이터는 문자열 형태가 된다.
    chosen = int(request.GET['number'])
    result = []
    if chosen >= 1 and chosen <= 45:
        result.append(chosen)

    box = [] # 입력하지 않은 숫자
    for i in range(0, 45):
        if chosen != i+1:
            box.append(i+1)

    random.shuffle(box)

    while len(result) < 6:
        result.append((box.pop()))

    context = {
        'numbers': result
    }
    return render(request, 'first/result.html', context)
```