---
layout: post
title: HttpResponseRedirect 생성자 안에서 reverse() 함수
tags: [django]
bigimg: /img/title_img/201906.jpg
---

```python
# 웹 앱/views.py
from django.urls import reverse

def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))
```
```python
# 웹 앱/ursl.py
from django.urls import path
from . import views

app_name = 'polls'

urlpatterns = [
    path('', views.index, name="index"),
    path('<int:question_id>/', views.detail, name='detail'),
    path('<int:question_id>/results/', views.results, name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```
* HttpResponseRedirect 생성자 안에 사용하는 reverse() 함수는  URL을 하드코딩하지 않도록 한다. 전달하기 원하는 view name을 ursl.py에서 찾고 이에 해당하는 view를 가리킨다.
* 위의 예제에서는 `/polls/3/results/`와 같은 형태의 문자열을 리턴한다.
* `reverse` 또는 `reverse_lazy` 함수는 여러 개의 앱과 다양한 3rd 파티 앱들을 사용할 때 유용하다. 모든 앱들의 url들을 다 외울 수 없으니 앱이름과 라우팅 이름만 가지고 편리하게 사용할 수 있는 기능이다. 라우팅 이름은 보통 핸들러 함수(또는 뷰클래스) 이름과 유사하게 정의하기 때문에 쉽게 기억할 수 있다. 반대로 앱이 복잡하지 않고 url이 명확하다면 굳이 라우팅 이름을 정의할 필요도 없고 굳이 함수를 거칠 필요 없다.