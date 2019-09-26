---
layout: post
title: Django - Django Form
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### Django Form
* 장고 프레임워크 단에서 폼을 구성하기 쉽도록 지원하고 있다.
    * binding : 모델 클래스의 모델 정보들과 연동할 수 있다.
    * Validation 체크 : 입력된 정보들의 유효성 검사를 쉽게 해준다.
    * sanitisation : 악의적인 데이터를 필터링 한다.
    * 짧고 간결한 코드로 폼 인터페이스를 구현한다.

### 장고 폼 생성
* 폼 데이터를 위한 폼 클래스를 선언한다.
* 폼 클래스의 필드는 django 의 forms를 통해 선언하는 데, models.py에서 모델 클래스를 선언하는 방법과 유사하다.
* 해당 필드의 속성들은 소괄호 내에서 정의한다.
* CharField 타입의 기본 위젯은 input type="text"이다.
* 주로 사용되는 필드는 BooleanField, CharField, ChoiceField, DateField, EmailField, FileField, FloatField, ComboField 등이 있다. 그 외에 어떤 속성과 필드가 있는 지는 [장고 문서](https://docs.djangoproject.com/ko/2.1/ref/forms/fields/)에서 확인하자.

```python
# second/form.py
from django import forms

class PostForm(forms.Form): # django Form 클래스를 상속
    # label : 폼에서 텍스트로 보여지는 것을 설정
    title = forms.CharField(label="제목", max_length=200)
    content = forms.CharField(label="내용", widget=forms.Textarea)
```

* view 메소드를 추가한다.

```python
# second/views.py
from . forms import PostForm

def create(request):
    form = PostForm()
    return render(request, 'second/create.html', { 'form': form })
```

* 폼 템플릿 파일을 추가한다.
    * csrf_token : 유효한 요청임을 검증하기 위한 문자열. 템플릿으로 만들어둔 폼을 통해서만 데이터가 들어오도록 만든다.
    * 입력받은 form 변수를 출력하게 되면 PostForm 클래스에서 선언한 필드대로 html로 변환되서 출력된다.

```html
<!-- second/templates/second/create.html -->
<form action="/" method="post">
    {% raw %}{% csrf_token %}
    {{ form }}{% endraw %}
    <button type="submit">제출</button>
</form>
```

* 지정한 view 메소드를 url과 연결한다.

```python
# second/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list, name="list"),
    path('create/', views.create, name="create"),
]
```

### 폼 데이터 전송
* create 페이지의 폼에서 입력한 데이터를 confirm 페이지에서 조회되도록 만든다.
* view 메소드를 추가한다.

```python
# second/views.py
from django.http import HttpResponseRedirect

def confirm(request):
    # POST로 넘어온 데이터를 바로 PostForm 클래스의 생성자에 전달한다.
    form = PostForm(request.POST)
    if form.is_valid(): # 정의한 validation 조건 통과
        return render(request, 'second/confirm.html', { "form": form })
    # 데이터가 유효하지 않으면 create 입력 폼으로 리다이렉트
    return HttpResponseRedirect('/second/create/')
```

* confirm 템플릿을 추가한다.

```html
<!-- second/templates/second/confirm.html -->
{% raw %}<body>
    <h4>{{ form.title.value }}</h4>
    <p>{{ form.content.value }}</p>
</body>{% endraw %}
```

* view 메소드에 url을 연결한다.

```python
# second/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list, name="list"),
    path('create/', views.create, name="create"),
    path('confirm/', views.confirm, name="confirm")
]
```

* create 페이지에서 요청 url을 수정한다.

```html
<!-- second/templates/create.html -->
{% raw %}<form action="{% url 'confirm' %}" method="post">
    {% csrf_token %}
    {{ form }}{% endraw %}
    <button type="submit">제출</button>
</form>
```