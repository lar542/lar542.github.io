---
layout: post
title: Django - 로그아웃
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 이메일 인증](https://swarf00.github.io/2018/12/14/logout.html#2-%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83)을 참고

### 로그아웃
* 로그아웃은 화면도 필요없고 단지 세션을 정리해주는 기능만 있으면 된다.
* 장고에서는 이 기능을 `LogoutView`를 통해 제공하기 때문에 urls.py의 urlpattern에 등록해주기만 하면 된다.

```python
# user/urls.py
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('logout/', LogoutView.as_view(), name="logout")
]
```

* 로그아웃 이후에 리다이렉트할 url은 설정파일의 `LOGOUT_REDIRECT_URL` 변수에 지정해주면 된다.

```python
# conf/settings.py

LOGOUT_REDIRECT_URL = '/board/'
```