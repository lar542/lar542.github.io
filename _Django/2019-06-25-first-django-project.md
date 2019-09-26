---
layout: post
title: Django Relation - Join
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### Join
* Review 조회 시 바로 join을 사용하여 Restaurant을 함께 가져오려면 select_related() 메소드를 사용하면 된다.

```python
third/views.py
def review_list(request):
    reviews = Review.objects.all().select_related().order_by('-created_at')
    paginator = Paginator(reviews, 10)  # 한 페이지에 10개씩 표시
    page = request.GET.get('page')  # query params에서 page 데이터를 가져옴
    items = paginator.get_page(page)  # 해당 페이지의 아이템으로 필터링
    context = {
        'reviews': items
    }
    return render(request, 'third/review_list.html', context)
```

* [다양한 조인의 종류](https://ko.wikipedia.org/wiki/Join_(SQL))