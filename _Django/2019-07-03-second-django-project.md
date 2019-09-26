---
layout: post
title: Django - 로그인
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 사용자 인증](https://swarf00.github.io/2018/12/07/registration.html)을 참고

* view에 LoginView를 상속받는 메소드를 정의한다. LoginView는 FormView를 상속받는 클래스인 데, FormView는 유효성 검증에 성공하면 form_valid() 메소드를 호출하고 실패하면 form_invalid() 메소드를 호출한다.
* 인증에 실패할 경우 에러 메시지를 출력하기 위해 form_invalid() 메소드를 오버라이딩한다.

```python
# user/views.py
from django.contrib.auth.views import LoginView
from django.contrib import messages

class UserLogin(LoginView):
    template_name = 'user/login.html'

    # 유효성 검증에 실패한 경우 form_invalid 메소드를 오버라이딩해서 에러 메시지를 출력
    def form_invalid(self, form):
        messages.error(self.request, '로그인에 실패하였습니다.', extra_tags='danger')
        return super().form_invalid(form)
```

* 템플릿을 만든 후 로그인에 시도하면 404 에러로 `The current path, accounts/profile/, didn't match any of these.`와 같은 오류 내용을 보인다.
* 즉, accounts/profile/ 접속을 시도했으나 존재하지 않는 페이지라는 오류이다.
* LoginView가 유효성에 통과할 경우 해당 페이지로 리다이렉트하는 것 같다. LoginView의 일부 코드를 보면 다음과 같다.

```python
redirect_field_name = REDIRECT_FIELD_NAME # 해당 변수 값은 next를 나타냄

def get_success_url(self):
    url = self.get_redirect_url()
    return url or resolve_url(settings.LOGIN_REDIRECT_URL) # 3. 설정파일에 설정된 LOGIN_REDIRECT_URL 변수에 설정된 값, 기본 값은 /accounts/profile/

def get_redirect_url(self):
    """Return the user-originating redirect URL if it's safe."""
    redirect_to = self.request.POST.get(
        self.redirect_field_name, # 1. 폼의 필드 중 next 이름을 가진 필드 값
        self.request.GET.get(self.redirect_field_name, '')
        # 2. query parameter 중 next 이름을 가진 값
    )
    url_is_safe = is_safe_url(
        url=redirect_to,
        allowed_hosts=self.get_success_url_allowed_hosts(),
        require_https=self.request.is_secure(),
    )
    return redirect_to if url_is_safe else ''

def form_valid(self, form):
    """Security check complete. Log the user in."""
    auth_login(self.request, form.get_user())
    return HttpResponseRedirect(self.get_success_url())
```

* form_valid 함수에서 검증에 성공하면 self.get_success_url() 함수가 리턴하는 주소로 리다이렉트한다.
* self.get_success_url() 메소드는 3가지의 값들을 순서대로 검색하여 가장 먼저 검색된 값을 반환한다. 아무 설정을 하지 않으면 LOGIN_REDIRECT_URL에 정의된 `/accounts/profile/`로 반환하게 된다.
* 위의 3가지 중 1가지 이상을 선택하여 원하는 url로 이동시키면 된다.
    * 1번 : form에 next라는 이름의 hidden 필드를 추가하고 `/board/` 값을 세팅한다.
    * 2번 : form의 action 속성에 `/user/login?next=/board/`로 설정한다.
    * 3번 : 설정파일에 `LOGIN_REDIRECT_URL = '/board/'`라고 설정한다.
    * 4번 : `get_success_url()` 메소드를 오버라이딩해서 `/board/` 문자열을 반환한다.
* 이 4가지 방법은 사용할 수 있는 케이스는 다음과 같다.
    * 사용자가 로그인 후 아무런 조건이 없을 때 이동할 페이지. 기본적인 redirect url → `3번`
    * 다양한 방식의 로그인을 제공하여 로그인 이후 이동할 페이지가 단순한 규칙으로 다를 경우. ex) 모바일과 PC버전의 화면을 각각 제공하며 url의 path에 따라 화면이 결정될 경우 /m/user/login/ => /m/article/, /user/login => /article/ 또는 다국어를 지원해서 언어별로 path를 구분하는 경우 /ko/user/login => /ko/article/, /en/user/login => /en/article/ → `2번`
    * 로그인하기 전에는 redirect url을 알 수 없는 경우. ex) 로그인한 사용자의 권한레벨에 따라 슈퍼유저인 경우 admin 사이트로, staff 권한인 경우 대시보드 화면으로 이동, 로그인한 사용자의 연령이 20세 미만일 경우 특정화면으로 이동 → `4번`, `get_success_url()` 메소드를 케이스 별로 처리하도록 오버라이딩
    * 어떤 화면으로 이동하려 했으나 인증된 사용자만 접근이 허락된 화면이어서 자동으로 로그인화면으로 이동한 경우 ex) 로그인 하지 않은 사용자가 /admin/user/user/ 를 접근했으나 강제로 로그인 화면으로 이동되고, 로그인된 이후에 원래 사용자가 접근하려 했던 /admin/user/user/ 로 되돌려 보내야 하는 경우 → `2번`
* 4번은 기본적으로 제공하는 루틴을 무시하고 재정의하는 것이니 코드의 일관성을 해치므로 피할 수 있으면 피한다. 
* 3번 방법은 무조건 설정한다. 
* 예외적인 케이스는 전부 2번 방법으로 처리한다. 만일 2번 방법보다 1번의 방법이 코드가 효율적이거나 url로 redirect url이 노출되고 싶지 않은 경우 1번을 사용한다.
* 현재는 3번 방법으로 리다이렉트할 url을 지정한다.

```python
# conf/settings.py

# 로그인 시 리다이렉트하는 url
LOGIN_REDIRECT_URL = '/board/'
```

* 이제 템플릿에서 로그인 상태와 로그아웃 상태일 때를 구분해서 보여준다.
* 장고의 미들웨어 중에 사용자 인증에 관한 처리를 담당하는 `django.contrib.sessions.middleware.SessionMiddleware`와 `django.contrib.auth.middleware.AuthenticationMiddleware`가 있다.
* SessionMiddleware : 로그인함수(auth_login)를 통해 생성된 세션을 관리한다. 세션이 유효한지 만료되었는지 판단 해서 유효한 경우에는 request 객체에 sesstion이라는 변수에 세션정보를 저장한다.
* AuthenticationMiddleware : request.sesstion 값을 가지고 어떤 사용자인지 확인한다. 확인된 사용자는 request.user 객체에 해당 사용자의 모델 인스턴스를 저장한다.

```html
<!-- board/templates/board/navbar.html -->

{% raw %}<div class="navbar-nav">
    {% if request.user.is_authenticated %}
    <a class="nav-item nav-link active" href="{% url 'board:write' %}">글 쓰기</a>
    <a class="nav-item nav-link active" href="#">내가 쓴 글 보기</a>
    <a class="nav-item nav-link active" href="#">로그아웃</a>
    {% else %}
    <a class="nav-item nav-link active" href="{% url 'user:login' %}">로그인</a>
    <a class="nav-item nav-link active" href="{% url 'user:join' %}">가입</a>
    {% endif %}
</div>{% endraw %}
```