---
layout: post
title: Django - 집계
subtitle: 음식점 별 리슈 수, 리뷰 평균 점수
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

* 집계(Aggregation)에 대한 자세한 내용은 [장고 문서](https://docs.djangoproject.com/ko/2.2/topics/db/aggregation/)를 확인하자.

### 음식점 별 리뷰 수(Count), 음식점 별 평균 점수(Avg)
* annotate : 집계 결과 데이터를 뽑아낼 때 사용한다. ORM 연산 메소드인 Count, Sum, Avg 등과 함께 사용한다.
* `.annotate(counts = Count('review'))`
* `.annotate(avgs = Avg('review__point'))`

```python
# third/views.py
def list(request):
    restaurants = Restaurant.objects.all()\
        .annotate(reviews_count = Count('review'))\
        .annotate(average_point=Avg('review__point'))
    page = request.GET.get('page')  # 파라미터로 넘어온 현재 페이지 값
    paginator = Paginator(restaurants, 5) # 한 페이지에 5개씩 표시
    items = paginator.get_page(page) # 해당 페이지에 맞는 리스트로 필터링
    context = {
        "restaurants": items
    }
    return render(request, 'third/list.html', context)
```

* 각각 지정해둔 속성명인 reviews_count, average_point로 꺼낼 수 있다.

```html
<!-- third/templates/third/list.html -->
...{% raw %}
<div class="card-body">
    <h5 class="card-title">{{ item.name }}</h5>
    <h6 class="card-subtitle mb-2 text-muted">{{ item.address }}</h6>
    <p class="card-text">리뷰 : {{ item.reviews_count }}, 평점: {{ item.average_point }}</p>
    <p class="card-text">음식점 설명</p>
    <a href="{% url 'restaurant-detail' id=item.id %}" class="card-link">자세히 보기</a>
    <a href="{% url 'restaurant-update' %}?id={{ item.id }}" class="card-link">수정하기</a>
</div>{% endraw %}
...
```