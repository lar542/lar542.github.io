---
layout: post
title: Django -  인증 이메일 발송
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 이메일 인증](https://swarf00.github.io/2018/12/14/logout.html)을 참고  
[django.core.mail](https://docs.djangoproject.com/en/2.2/topics/email/#send-mail)

* User 모델의 `is_active`가 True인 사용자만 인증된 사용자로 본다. 
* 가입 시 디폴트로 False로 저장하고 이메일 인증이 완료될 때 True로 변경해주도록 구현한다.

```python
# user/models.py

class User(AbstractBaseUser, PermissionsMixin):
    ...
    is_active = models.BooleanField('사용여부', default=False)
    ...
```

### 회원가입 시 인증 이메일 발송
* 가입 즉시 인증 이메일을 발송하기 위해 `form_valid` 메소드를 오버라이딩한다.
* form_valid : 폼 객체의 필드 값들이 유효성 검증을 통과할 경우 호출되며 필드 값들을 DB에 저장하는 역할.

```python
# user/views.py
from user.forms import UserRegisterForm
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import render

# 인증 이메일 발송
class VerifyEmailMixin:
    email_template_name = 'user/verify.html'
    token_generator = default_token_generator  # 사용자 데이터를 가지고 해시데이터를 만들어주는 객체

    def send_verification_email(self, user):
        token = self.token_generator.make_token(user) # 사용자 고유의 토큰을 생성
        url = self.build_verification_link(user, token)
        subject = '[가입 인증] 환영합니다!'
        message = '다음 주소로 이동하셔서 인증해주세요. {}'.format(url)
        html_message = render(self.request, self.email_template_name, {'url': url}).content.decode('utf-8')
        user.email_user(subject, message, html_message=html_message) # 이메일 발송
        messages.info(self.request, '환영합니다! 가입하신 이메일주소로 인증메일을 발송했으니 확인 후 인증해주세요!')

    def build_verification_link(self, user, token):
        return '{}/user/{}/verify/{}'.format(self.request.META.get('HTTP_ORIGIN'), user.pk, token)

# 회원가입
class UserRegister(VerifyEmailMixin, CreateView):
    model = get_user_model()
    form_class = UserRegisterForm
    template_name = 'user/join.html'
    success_url = '/user/login/'
    verify_url = '/user/verify/'
    
    def form_valid(self, form):
        response = super().form_valid(form)
        if form.instance:
            self.send_verification_email(form.instance)
        return response
```
* 이메일을 발송하는 부분만 VerifyEmailMixin로 분리하여 회원가입 view, 재인증 view에서 호출하도록 한다.
* ModelForm을 상속받는 클래스인 UserRegisterForm은 form_valid 메소드를 호출하면 데이터를 DB에 저장하고 그 저장된 User 객체를 from 객체의 `instance`에 저장한다.
* `default_token_generator`를 이용해 from.instance(User)에 대한 고유의 `token`을 생성하도록 한다. 
* 생성한 토큰과 사용자 pk 값을 url에 포함시켜 어떤 사용자의 토큰인지 확인할 수 있는 인증 url을 만든다.
* 장고의 django.core.mail 모듈의 send_mail() 파라미터로 발송할 이메일의 제목, 메시지, 발신자, 수신자 목록 뿐만 아니라 조회할 이메일의 html 코드도 전달할 수 있다. 이를 위해서는 먼저 html 코드에 대해 HTTP로 전송할 수 있도록 디코딩해야 한다. `HttpResponse` 객체의 `content` 속성에 메시지가 저장되어 있으므로 `decode` 메소드로 `utf-8`로 디코딩한다.
* 이메일에 message와 html_message 둘 다 전달하는 이유는 일부 이메일 클라이언트에서 html 형식의 이메일을 지원하지 않을 수도 있기 때문에 기본적으로 보여줄 수 있는 텍스트 메시지도 함께 전달한다.

### 이메일 템플릿 작성
* 이메일 템플릿의 코드는 html의 head와 body없이 body 안의 코드만 작성한다.
* 이메일에는 CSS가 적용되지 않을 수도 있으니 inline style 로 디자인해야 한다.
* [뉴스레터 디자인 에디터](https://grapesjs.com/demo-newsletter-editor.html)

```html
<!-- user/templates/user/verify.html -->
{% raw %}
<h1 class="card-title" style="box-sizing: border-box; font-size: 25px; font-weight: 300; color: rgb(68, 68, 68);">아래 링크를 클릭해주세요!
</h1>
<p class="card-text" style="box-sizing: border-box;"><a href="{{ url }}">가입 인증하기</a>{% endraw %}
```

### 인증 페이지
* 이메일로 발송한 링크를 클릭했을 때 이동할 인증페이지를 만든다.
* 클릭할 url의 사용자 pk 값과 token을 확인하여 해당 사용자의 정상적인 token 값인지 확인해야 한다.
* `default_token_generator`를 통해 토큰의 유효성을 확인할 수 있다.

```python
# user/views.py
from django.views.generic.base import TemplateView
from django.shortcuts import redirect

class UserVerification(TemplateView):
    model = get_user_model()
    token_generator = default_token_generator

    def get(self, request, *args, **kwargs):
        if self.is_valid_token(kwargs=kwargs):
            messages.info(request, '인증이 완료되었습니다.')
        else:
            messages.error(request, '인증이 실패하였습니다.')
        return redirect('user:login')

    def is_valid_token(self, **kwargs):
        pk = kwargs.get('kwargs').get('pk')
        token = kwargs.get('kwargs').get('token')
        user = self.model.objects.get(pk=pk)
        is_valid = self.token_generator.check_token(user, token)
        if is_valid:
            user.is_active = True
            user.save()
        return is_valid
```
* 주의점은 인증에 실패했다고 is_active를 False로 변경해선 안 된다. url을 난수로 대입할 경우 정상적인 사용자 id의 인증상태가 변경될 수도 있기 때문이다. 
* 아래와 같이 인증 페이지에 대한 url을 등록한다.

```python
# user/urls.py
app_name = 'user'

urlpatterns = [
    path('<pk>/verify/<token>', views.UserVerification.as_view(), name="verify"),
]
```