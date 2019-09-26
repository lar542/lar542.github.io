---
layout: post
title: 재귀(Recursion)
subtitle: Hello Coding 그림으로 개념을 이해하는 알고리즘 정리
tags: [algorithms]
bigimg: /img/title_img/201906.jpg
---

* 함수가 자기 자신을 호출하는 것
* 재귀 함수는 기본 단계와 재귀 단계로 나누어져 있다.
* 기본 단계 : 무한 반복으로 빠져들지 않게 하는 부분
* 재귀 단계 : 자기 자신을 호출하는 부분

### 상자 안에서 열쇠를 찾는 코드를 의사코드로 나타내기
※ 의사코드 : 문제와 풀이 방법을 간단한 코드 형태로 설명한 것
* while 반복문을 사용한 경우

```python
def look_for_key(main_box):
    pile = main_box.make_a_pile_to_look_through()
    while pile is not empty:
        box = pile.grab_a_box()
        for item in box:
            if item.is_a_box():
                pile.append(item)
            elif item.is_a_key():
                print "열쇠를 찾았어요!"
```

* 재귀를 사용한 경우

```python
def look_for_key(box):
  for item in box:
      if item.is_a_box():
          look_for_key(item)
      elif item.is_a_key():
          print "열쇠를 찾았어요!"
```

### 재귀를 사용해 팩토리얼 함수 구현하기

```python
def fact(x):
    if x == 1:
        return 1
    else:
        return x * fact(x-1)
 
def main():
    print(fact(5))
 
if __name__ == "__main__":
    main()
```