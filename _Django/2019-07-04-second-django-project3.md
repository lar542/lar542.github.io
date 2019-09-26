---
layout: post
title: Django - django.core.mail 모듈로 이메일 발송
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 이메일 인증](https://swarf00.github.io/2018/12/14/logout.html)을 참고  
[django.core.mail](https://docs.djangoproject.com/en/2.2/topics/email/#send-mail)

### django.core.mail 모듈로 이메일 발송
* django.core.mail 모듈로 이메일을 발송해보자. (Gmail 기준)
* 먼저 Gmail의 [IMAP 설정](https://support.google.com/mail/answer/7126229?hl=ko&rd=3&visit_id=1-636281811566888160-3239280507#ts=1665018)을 변경해준다.
* [보안 수준이 낮은 앱 허용](https://support.google.com/accounts/answer/6010255)으로 설정한다.
* 설정파일에 Gamil을 연동한다.

```python
# conf/settings.py

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = '아이디@gmail.com'
EMAIL_HOST_PASSWORD = '비밀번호'
EMAIL_USE_TLS = True
```

* User 모델에 이메일 발송 메소드를 작성한다.

```python
# user/models.py
from django.core.mail import send_mail
from conf import settings

class User(AbstractBaseUser, PermissionsMixin):
    ...

    def email_user(self, subject, message, html_message):
        return send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[self.email],
            html_message=html_message)
```

* 파이썬 쉘에서 이메일 발송 테스트를 해보자.

```python
from user.models import User

user = User.objects.get(pk=1)
user.send_mail('제목', '내용', 'html 내용')
```