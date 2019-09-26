---
layout: post
title: Django - Model Form
subtitle: Model Form 사용, Model Form으로 데이터 저장
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### Model Form
* 장고의 **ModelForm**을 사용하여 기존 모델 클래스(Post)의 필드를 입력받는 장고 폼을 구현해보자.
* 장고 폼(PostForm)만으로 데이터를 받아서 Post로 레코드를 추가하게 되면, Post에 속성이 추가될 때마다 PostForm에도 추가를 해주어야하고, 넘어온 폼 데이터를 저장하려면 Post 모델 클래스의 인스턴스에 넣어주어야 하는 번거로움이 있다.
* 다음과 같이 선언하면 기존의 PostForm과 동일한 형태로 사용할 수 있다.

```python
# second/forms.py
from django.forms import ModelForm
from second.models import Post
from django.utils.translation import gettext_lazy as _

# class PostForm(forms.Form): # django Form 클래스를 상속
#     # label : 폼에서 텍스트로 보여지는 것을 설정
#     title = forms.CharField(label="제목", max_length=200)
#     content = forms.CharField(label="내용", widget=forms.Textarea)

class PostForm(ModelForm): # ModelForm을 상속
    class Meta:
        model = Post # 사용할 클래스
        fields = ['title', 'content'] # 압력받을 필드, '__all__' 설정시 전체 필드 추가
        labels = {
            'title': _("제목"), # gettext_lazy는 "제목"이라는 텍스트를 가져오는 메소드
            "content": _("내용"),
        }
        help_texts = {
            'title': _("제목을 입력해주세요."),
            "content": _("내용을 입력해주세요."),
        }
        error_message = {
            "name": {
                "max_length": _("제목이 너무 깁니다. 30자 이하로 작성해주세요.")
            }
        }
```

* {% raw %}{{ form }} 대신 {{ form.as_table }}을 사용한다.{% endraw %}

```html
<!-- second/templates/second/create.html -->
{% raw %}<form action="{% url 'confirm' %}" method="post">
    {% csrf_token %}
    <table>
        {{ form.as_table }}
    </table>
    <button type="submit">제출</button>
</form>{% endraw %}
```

### Model Form으로 데이터 저장
* create 메소드에 GET 요청인 경우 create 페이지를 조회하고, POST 요청인 경우 데이터를 저장하도록 요청 메소드에 따라 구분해서 처리해보자.

```python
# second/views.py
def create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            new_item = form.save() # POST로 넘어온 폼 데이터를 저장
        return HttpResponseRedirect('/second/list/')
    form = PostForm()
    return render(request, 'second/create.html', { 'form': form })
```

* 요청 url을 create로 변경한다.

```html
<!-- second/templates/second/create.html -->
{% raw %}<form action="{% url 'create' %}" method="post">
    {% csrf_token %}
    <table>
        {{ form.as_table }}
    </table>
    <button type="submit">제출</button>
</form>{% endraw %}
```