---
layout: post
title: Django - Auth 프레임워크, 커스텀 사용자 모델
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 사용자 인증](https://swarf00.github.io/2018/12/07/registration.html)을 참고

### Auth 프레임워크
* 장고 admin 사이트에 접속할 때 생성했던 슈퍼유저가 장고에서 제공하는 Auth 프레임워크를 이용한다.
* Auth 프레임워크는 가입, 로그인, 로그아웃 세 가지의 기능을 제공한다.
* Auth 프레임워크의 User 모델을 확인해보자. 위치는 보통 가상환경의 `Lib\site-packages\django\contrib\auth\models.py`에 있다.
* 문서 [장고 사용자 인증](https://docs.djangoproject.com/en/2.2/topics/auth/), [django.contrib.auth](https://docs.djangoproject.com/en/2.2/ref/contrib/auth/) 확인

```python
class AbstractUser(AbstractBaseUser, PermissionsMixin):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Username and password are required. Other fields are optional.
    """
    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    email = models.EmailField(_('email address'), blank=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        abstract = True # abstract 옵션이 True로 설정된 클래스는 makemigrations 커맨드 실행 시에 무시한다.

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)


class User(AbstractUser):
    """
    Users within the Django authentication system are represented by this
    model.

    Username and password are required. Other fields are optional.
    """
    class Meta(AbstractUser.Meta):
        swappable = 'AUTH_USER_MODEL'
```
* abstract 옵션이 True로 설정된 클래스는 makemigrations 커맨드 실행 시에 무시한다.
* Abstract 클래스는 보통 여러 개의 비슷한 클래스를 정의할 때 사용되는 데, Abstract 모델 클래스를 상속받은 클래스(서브클래스)는 상속받은 필드와 메소드는 정의할 필요는 없고 추가되는 필드와 메소드만 정의하면 된다. 
* 즉, 여러 종류의 사용자 모델이 필요하다면 AbstractUser 클래스를 상속받아 사용하면 된다.

### 커스텀 사용자 모델
* AbstractUser 클래스를 사용하지 않고 새로 사용자 정보 모델을 정의해보자.
* 다른 프로젝트에서도 사용할 수 있게 별도의 앱으로 분리하자.

```python
# user/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField('아이디', max_length=10, unique=True)
    password = models.CharField('비밀번호', max_length=10)
    email = models.EmailField('이메일', unique=True)
    is_staff = models.BooleanField('스태프 권한', default=False)
    is_active = models.BooleanField('사용여부', default=True)
    created_at = models.DateTimeField('가입일', auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'username' # 아이디를 사용자 식별자로 설정
    REQUIRED_FIELDS = ['email'] # 필수입력값
```

* 장고에서 사용자 모델을 여러 앱에서 참조하고 있는 데, 현재 사용자 모델이 무엇인지 가리키는 AUTH_USER_MODEL 설정을 해주어야 한다.

```python
# conf/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'polls',
    'board',
    'user',
]

AUTH_USER_MODEL = 'user.User'
```

* migrate을 할 때 admin의 마이그레이션 파일이 user 앱의 0001_initial 마이그레이션 파일에 의존적이다는 오류가 뜬다. 이는 admin 사이트의 모델이 AUTH_USER_MODEL에 의존적이기 대문이다. admin 앱이 이미 마이그레이션 된 상태에서 커스텀 유저 모델을 마이그레이션을 하여니 문제가 된 것이다. 
* admin 앱을 잠시 주석처리 한 후 다시 migrate를 하면 된다. 프로젝트 폴더의 settings.py의 admin 앱을 주석 처리, urls.py의 admin.site.urls도 주석 처리
* migrate가 되면 주석을 해제하고 다시 슈퍼유저 계정을 생성해주자.

```
python manage.py createsuperuser
```