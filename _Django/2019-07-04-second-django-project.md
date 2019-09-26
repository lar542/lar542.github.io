---
layout: post
title: Django - 인증된 사용자만 접근할 수 있게 설정, 세션 유효기간 설정
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 사용자 인증](https://swarf00.github.io/2018/12/07/registration.html)을 참고

### 인증된 사용자만 접근할 수 있게 설정
* 게시글을 등록, 수정, 삭제 등의 요청을 할 때 로그인한 사용자만 가능하게 설정해보자.
* CBV에서는 `LoginRequiredMixin`을 view에 추가해주고, 로그인이 되어 있지 않은 경우에는 로그인 url로 리다이렉트하기 위해 LoginRequiredMixin의 `login_url`이라는 클래스 변수에 url을 지정해주거나 설정파일에 `LOGIN_URL` 변수에 url을 지정하면 된다.
* 여기서는 공통적인 로그인 url을 사용하므로 설정파일에 지정 후 view에서 클래스변수로 추가하자.

```python
# conf/settings.py

LOGIN_URL = '/user/login/'
```

* 이 때 view의 상속 순서는 LoginRequiredMixin을 가장 앞에 지정해야한다.

```python
# board/views.py
from django.contrib.auth.mixins import LoginRequiredMixin
from conf import settings

class WriteView(LoginRequiredMixin, generic.CreateView):
    login_url = settings.LOGIN_URL
    model = Board
    form_class = BoardForm
    success_url = '/board/'

class UpdateView(LoginRequiredMixin, generic.UpdateView):
    login_url = settings.LOGIN_URL
    model = Board
    form_class = BoardForm
    success_url = '/board/'
    template_name_suffix = '_update'

class DeleteView(LoginRequiredMixin, generic.DeleteView):
    login_url = settings.LOGIN_URL
    model = Board
    success_url = '/board/'
    template_name_suffix = '_delete'
```

### 세션 유효기간 설정
* 세션의 유효기간이 설정되면 쿠키도 동일한 유효기간이 설정된다.
* 브라우저에서는 유효기간이 지난 쿠키는 자동 삭제한다.
* 만약 쿠키를 조작해 유효기간을 변경하더라도 서버에 저장된 유효기간으로 유효성을 검사한다.
* 유효기간 설정은 설정파일에 `SESSION_COOKIE_AGE` 변수에 초단뒤 기간을 설정하면 된다.

```python
# conf/settings.py

SESSION_COOKIE_AGE = 60 * 60
```