---
layout: post
title: Django - 게시글 비밀번호
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

### 게시글 비밀번호
* 모델 클래스에 비밀번호 필드를 추가한다.
* 이미 기존에 저장되어있는 레코드에 컬럼을 추가하는 것이기 때문에 필드 속성으로 default는 None으로 줘서 기존 컬럼 값의 비밀번호는 NULL 처리를 한다.

```python
# third/models.py
class Restaurant(models.Model):
    name = models.CharField(max_length=30)
    address = models.CharField(max_length=200)

    image = models.CharField(max_length=500, default=None, null=True)
    password = models.CharField(max_length=20, default=None, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
```

* 모델을 수정하면 데이터베이스에 적용하는 명령어를 사용한다.

```
python manage.py makemigrations third
python manage.py migrate
```

* 모델 클래스가 수정됨에 따라 모델 폼도 추가된 필드를 작성해준다.
* RestaurantForm을 상속하는 UpdateRestaurantForm 모델 폼도 추가했는 데, 이는 게시물을 수정하거나 삭제할 때 비밀번호를 update를 하면 안 되고 기존의 비밀번호가 맞는지 검증을 하기 위해 update할 때 비밀번호만 제외하고 나머지 필드만 update를 시키기 위함이다.

```python
# third/forms.py
class RestaurantForm(ModelForm):
    class Meta:
        model = Restaurant
        fields = ['name', 'address', 'image', 'password']
        labels = {
            'name': _('이름'),
            'address': _('주소'),
            'image': _('이미지 url'),
            'password': _('게시물 비밀번호'),
        }
        help_texts = {
            'name': _('이름을 입력해주세요.'),
            'address': _('주소를 입력해주세요.'),
            'image': _('이미지 url을 입력해주세요.'),
            'password': _('비밀번호를 입력해주세요.'),
        }
        widgets = {
            'password': forms.PasswordInput()
        }
        error_messages = {
            'name': {
                'mex_length': _('이름은 30자 이하로 정해주세요.')
            },
            'image': {
                'max_length': _('이미지 주소의 길이가 너무 깁니다. 500자 이하로 정해주세요.')
            },
            'password': {
                'max_length': _('비밀번호가 너무 깁니다. 20자 이하로 정해주세요.')
            }
        }


class UpdateRestaurantForm(RestaurantForm):
    class Meta:
        model = Restaurant
        exclude = ['password']
```

* 수정에 대해 GET으로 접근하면 비밀번호 값은 비우고, POST으로 접근하면 비밀번호 검증 후 수정한다.
* 삭제는 GET으로 접근하면 비밀번호 화면을 보이고, POST로 접근하면 비밀번호를 검증 후 삭제한다.

```python
# third/views.py
def update(request):
    if request.method == 'POST' and 'id' in request.POST:
        item = get_object_or_404(Restaurant, pk=request.POST.get('id'))
        password = request.POST.get('password', '') # 비밀번호 값이 있으면 해당 값을 가져오고 없으면 공백으로 가져옴
        form = UpdateRestaurantForm(request.POST, instance=item)
        if form.is_valid() and password == item.password: # 유효성 체크 및 비밀번호 검증
            item = form.save()
    elif request.method == 'GET':
        item = get_object_or_404(Restaurant, pk=request.GET.get('id'))
        form = RestaurantForm(instance=item)
        form.password = ""
        return render(request, 'third/update.html', {'form': form})
    return HttpResponseRedirect('/third/list/')


def delete(request, id):
    item = get_object_or_404(Restaurant, pk=id)
    if request.method == 'POST' and 'password' in request.POST:
        if item.password == request.POST.get('password'):
            item.delete()
            return redirect('list')
        return redirect('restaurant-detail', id=id)
    return render(request, 'third/delete.html', {'item': item})
```