---
layout: post
title: Django - 모델 클래스(파이썬 클래스) 선언
subtitle: Django 모델
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 모델
* 저장, 처리하기 위한 정보들을 구조화한 것. 예를들어 맛집 사이트의 정보를 모델링하는 과정은 다음과 같다.
    1. 정보의 종류 추출
        * 결정된 종류는 모델 클래스가 된다.
        * 맛집, 평가, 회원 등
    2. 각 종류의 속성 정의
        * 맛집 - 주소, 위치, 명칭, 전화번호, 사진 등
        * 평가 - 별점, 글쓴 시각, 글쓴 회원 등
        * 회원 - 이메일, 닉네임 등
    3. 각 속성의 자료형 결정
        * 맛집 - 주소(str), 위치(위경도-부동소수점형), 명칭(str) 등
    4. 속성 간의 릴레이션을 정의


### 데이터베이스
* 모델링한 데이터를 저장하고 관리하기 위한 시스템
* 장고에서 모델 클래스(파이썬 클래스)를 정의하면 하나의 클래스가 하나의 테이블로 만들어진다. 즉, 장고 웹 앱 내에서 구현되고 웹 앱이 구동되면 실제 데이터베이스와 연동된다. 


### 모델 클래스(파이썬 클래스) 선언
* 새로운 웹 앱 생성

```
python manage.py startapp second
```

* Post 클래스 선언

```python
# second/models.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=30) # 30자 이하의 문자열
    content = models.TextField() # 문자열 길이를 제한하지 않는 긴 문자열

    created_at = models.DateTimeField(auto_now_add=True) # 생성 시각
    updated_at = models.DateTimeField(auto_now=True) # 수정 시각

    # num_stars = models.IntegerField() 숫자 필드
```

* second의 urls.py를 생성한다.

```python
# second/urls.py
from django.urls import path
from . import views

urlpatterns = [

]
```

* 공통 urls.py에 second의 urls.py를 추가한다.
* first와 path의 첫 번째 인자가 겹치므로 첫 번째 path는 각 웹 앱의 이름으로 시작하는 것으로 수정한다.

```python
# 공통 urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('first/', include('first.urls')),
    path('second/', include('second.urls')),
    path('admin/', admin.site.urls),
]
```

* 공통 settings.py에도 second 웹 앱을 추가한다.
* DATABASES는 실제 데이터베이스를 구성하는 부분이다. 기본적으로 sqlite3라는 데이터베이스를 사용하도록 설정되어 있다. sqlite3는 연습용이거나 이용자가 적을 때 사용하기 적당하다.

```python
# 공통 settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'first',
    'second',
]

...

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

```