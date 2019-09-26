---
layout: post
title: 제너릭 뷰 시스템
tags: [django]
bigimg: /img/title_img/201906.jpg
---

* URL에서 전달된 매개변수에 따라 데이터베이스에서 데이터를 가져오는 것과 템플릿을 로드하고 렌더링된 템플릿을 리턴하는 기본 웹 개발의 일반적인 경우를 제너릭 뷰 시스템이라는 지름길을 제공한다.
* 제너릭 뷰는 일반적인 패턴을 추상화하여 코드를 줄일 수 있다.
* 제너릭 뷰로 전환하려면 urls.py와 views.py의 수정이 필요하다.

```python
# 웹 앱/urls.py
from django.urls import path
from . import views

app_name = 'polls'

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```
```python
# 웹 앱/views.py
# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     context = {'latest_question_list': latest_question_list}
#     return render(request, 'polls/index.html', context)

class IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        return Question.objects.order_by('-pub_date')[:5]


# def detail(request, question_id):
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, 'polls/detail.html', {'question': question})

class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'

# def results(request, question_id):
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, 'polls/results.html', {'question': question})

class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'
```
* DetailView 제너릭 뷰는 `<app name>/<model name>_detail.html`의 기본 템플릿을 사용하기 때문에 이미 있는 템플릿인 `polls/question_detail.html`을 사용하기 위해 template_name 속성에 해당 경로를 전달해준다.
* 이전에는 `question = get_object_or_404(Question, pk=question_id)` 형태로 모델의 데이터를 찾아 컨텍스트 변수에 담아 render로 넘겼었는 데, DetailView의 경우 컨텍스트 변수가 자동으로 제공된다. Django 모델 (Question)을 사용하기 때문에 Django는 컨텍스트 변수의 적절한 이름을 결정할 수 있다. 그러나 ListView의 경우 자동 생성 된 컨텍스트 변수는 question_list 이므로, 이것을 덮어 쓰려면 context_object_name 속성에 latest_question_list를 지정한다.