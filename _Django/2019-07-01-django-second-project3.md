---
layout: post
title: Django - CBV 회원가입 폼
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[장고(Django) 핥짝 맛보기 - 사용자 인증](https://swarf00.github.io/2018/12/07/registration.html)을 참고

* 회원가입에 대한 view를 CreateView를 만들자.
* model : 폼을 생성할 때 이 변수에 지정한 모델을 참조하고, 폼 필드들은 이 모델 필드의 속성을 참조한다. 
* fields : model이 정의되면 자동으로 폼 객체를 생성하는 데, 이때 폼의 필드는 이 클래스변수에 정의되어 있는 필드만 사용한다. 단, 장고에서 기본으로 생성되는 모델 폼을 사용할 경우에만 필요하다.
* template_name : 렌더링할 템플릿 경로

```python
# user/views.py
from . models import User
from django.views import generic

class UserRegister(generic.CreateView):
    model = User
    fields = ['username', 'email', 'password']
    template_name = 'user/join.html'
```

* 하지만 이 상태로 템플릿에 {% raw %}`{{ form.as_p }}` (또는 `as_table`, `as_ul`){% endraw %}를 사용할 때 비밀번호 필드는 그대로 input="text"로 나타나버린다.
* auth 프레임워크에서 제공하는 UserCreationForm을 사용해보자.
* model 변수에 User 모델을 지정하지 않고 유연한 방법으로 지정해보자.
* forms.py에 UserCreationForm을 상속받은 새로운 폼을 작성한다.
* model 변수의 get_user_model() : 프로젝트 폴더의 settings.py의 AUTH_USER_MODEL이 참조하는 모델을 찾아주는 함수
* fields : 정의된 모델에서 폼에 보여줄 필드를 정의한다. password는 UserCreationForm에서 자동 생성된다.

```python
# user/forms.py
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

class UserRegisterForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ['username', 'email']
```

* view에서 새로 만든 폼을 사용하도록 변경한다.
* view에서도 마찬가지로 get_user_model() 함수를 model 변수에 지정한다.

```python
from django.views import generic
from user.forms import UserRegisterForm
from django.contrib.auth import get_user_model

class UserRegister(generic.CreateView):
    model = get_user_model()
    form_class = UserRegisterForm
    template_name = 'user/join.html'
    success_url = '/board/'
```

* 템플릿에 {% raw %}`{{ form.as_p }}` (또는 `as_table`, `as_ul`){% endraw %}로 호출 시 UserCreationFrom이 상속받는 ModelForm의 help_text도 함께 보이기 때문에 form을 for문으로 출력한다.
* 유효성을 통과하지 못할 때마다 errors 변수에 오류 내용이 추가된다. 에러 메시지도 나타내도록 한다.

```html
{% raw %}<form method="post" action="{% url 'user:join' %}">
    {% csrf_token %}
    {% for field in form %}
    <div class="form-group">
        <label for="{{ field.id_for_label }}">{{ field.label }}</label>
        <input type="{{ field.field.widget.input_type }}"
                class="form-control {% if field.errors|length > 0 %}is-invalid{% endif %}"
                id="{{ field.id_for_label }}"
                name="{{ field.html_name }}"
                value="{{ field.value|default_if_none:'' }}">
        {% for error in field.errors %}
            <div class="invalid-feedback">{{ error }}</div>
        {% endfor %}
    </div>
    {% endfor %}
    <button type="submit" class="btn btn-primary btn-lg btn-block">가입</button>
</form>{% endraw %}
```

* UserCreationForm으로 자동 생성되는 필드는 레이블 값이 영어로 나타난다.
* settings.py의 LANGUAGE_CODE를 변경하면 장고에서 미리 번역해둔 문자열들로 치환된다.

```python
# conf/settings.py

LANGUAGE_CODE = 'ko-KR'
TIME_ZONE = 'Asia/Seoul'
```