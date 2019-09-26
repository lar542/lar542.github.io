---
layout: post
title: Django - Messages Framework (1회성 메시지)
tags: [django]
bigimg: /img/title_img/201907.jpg
---

[Messages Framework](https://jjinisystem.tistory.com/47) 정리 내용을 참고

### Messages Framework
* 1회성 메시지를 담는 용도
* HttpRequest 인스턴스를 통해 메시지를 담을 수 있다.
* 메시지는 1회 노출되고 사라진다.

### Message Levels
* Message Levels를 통해 메시지를 분류할 수 있다.
* 파이썬 로깅 모듈과 유사하며 레벨별로 필터링이 가능하다.
* 템플릿에서 다른 스타일로 노출이 가능하다.
    * DEBUG
    * INFO
    * SUCCESS
    * WARNING
    * ERROR

```python
# views.py
from django.contrib import messages

class CommentWrite(generic.CreateView):
    model = Comment
    fields = ['board', 'username', 'content']
    template_name = 'board/board_detail.html'

    def form_invalid(self, form):
        messages.error(self.request, '댓글을 입력해주세요!', extra_tags='danger')
        return HttpResponseRedirect(self.get_success_url())
```

* view에 메시지가 등록되면 템플릿 렌더링을 통해 해당 메시지 내용을 노출할 수 있다.
    * message.tags : 레벨을 제공
    * message.message : 메시지 내용을 제공

```html
{% raw %}{% if messages %}
{% for message in messages %}
    <div class="row" style="margin:20px auto;">
    <div class="col-sm-12">
        <div class="alert alert-danger">
        <strong>{{ message.tags }}!</strong> {{ message.message }}
        </div>
    </div>
    </div>
{% endfor %}
{% endif %}{% endraw %}
```