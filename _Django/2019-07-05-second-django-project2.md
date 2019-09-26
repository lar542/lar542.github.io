---
layout: post
title: Django -  인증 이메일 재발송
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 이메일 인증](https://swarf00.github.io/2018/12/14/logout.html)을 참고  
[django.core.mail](https://docs.djangoproject.com/en/2.2/topics/email/#send-mail)

### 인증 이메일 재발송
* 이메일 발송 부분은 분리했으니 재발송 view만 작성해준다.

```python
# user/views.py
from django.views.generic import CreateView, FormView
from user.forms import UserRegisterForm, VerificationEmailForm

# 인증 이메일 재발송
class ResendVerifyEmail(VerifyEmailMixin, FormView):
    model = get_user_model()
    form_class = VerificationEmailForm
    template_name = 'user/resend_verify_email.html'
    success_url = '/user/login/'

    def form_valid(self, form):
        email = form.cleaned_data['email']
        try:
            user = self.model.objects.get(email=email)
        except self.model.DoesNotExist:
            messages.error(self.request, '알 수 없는 사용자 입니다.')
        else:
            self.send_verification_email(user)
        return super().form_valid(form)
```
* from_class에 `VerificationEmailForm` 폼 클래스를 지정한다.
* ModelForm을 지정한 회원가입 view와 달리 VerificationEmailForm은 From을 상속한 클래스로 구현한다. DB에 저장할 것도 없고 success_url로 이동시키는 역할만 하기 위해서 이다.
* 폼 클래스는 유효성 검증이 끝나면 `cleaned_data` 변수에 각 필드 이름으로 사용자가 입력한 값을 저장한다. 
* 이메일이 확인되면 인증 이메일을 발송하는 메소드를 호출한다.

```python
# user/forms.py
from django import forms
from . validators import RegisteredEmailValidator

class VerificationEmailForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'autofocus': True}),
        validators=(forms.EmailField.default_validators + [RegisteredEmailValidator()])
    )
```

* 이메일 하나만 입력 받고, 유효성 검증 필터를 default_validators에 추가하기 위해 `RegisteredEmailValidator` 인스턴스를 사용한다.
* 에러 메시지를 필드에 표시하기 위해 view가 아니라 필드에 유효성을 검증한다.

```python
# user/validators.py
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

class RegisteredEmailValidator:
    user_model = get_user_model()
    code = 'invalid'

    def __call__(self, email):
        try:
            user = self.user_model.objects.get(email=email)
        except self.user_model.DoesNotExist:
            raise ValidationError('가입되지 않은 이메일입니다.', code=self.code)
        else:
            if user.is_active:
                raise ValidationError('이미 인증되어 있습니다.', code=self.code)
        return
```
* `RegisteredEmailValidator`는 이미 인증된 이메일인지, 가입된 적이 없는 이메일인지 검사하는 유효성 검증 필터로 구현한다.
* 필드의 유효성 검증 필터는 반드시 __call__ 메소드를 오버라이딩해야 한다.
* 폼의 필드는 유효성을 검증할 때 필드에 정의된 필터 리스트(`default_validators`)의 각 원소들이 호출되어 필드 값을 전달하여 검증한다.

```python
# user/urls.py
app_name = 'user'

urlpatterns = [
    path('resend_verify_email/', views.ResendVerifyEmail.as_view(), name="resend")
]
```
* 인증 이메일 재발송 view를 url에 등록한다.