---
layout: post
title: 이진 탐색(Binary Search)
subtitle: Hello Coding 그림으로 개념을 이해하는 알고리즘 정리
tags: [algorithms]
bigimg: /img/title_img/201906.jpg
---

* **오름차순으로 정렬된 리스트**에서 특정 값의 위치를 찾기 위해 처음부터 찾기 시작하는 것이 아니라 **중간**에서 찾기 시작하는 것
* 정렬된 리스트에만 사용할 수 있다
* 검색이 반복될 때마다 목표값을 찾을 확률은 두 배가 되므로 실행시간이 대폭 감소된다 (최대 log n번 만에 찾을 수 있음)

```python
# list 오름차순 정렬된 리스트
# item : 찾으려는 요소 값
def binary_search(list, item):
    low = 0
    high = len(list) - 1
     
    while (low <= high):
        mid = (low + high) // 2 #중간 위치
        guess = list[mid]
         
        if guess == item :
            print(item,"은",mid,"인덱스에 있습니다")
            break
        if guess < item :
            print("추측한 숫자가 작습니다", "인덱스 =", mid)
            low = mid + 1
        else :
            print("추측한 숫자가 큽니다", "인덱스 =", mid)
            high = mid - 1
     
def main():
    binary_search([1,2,3,4,5,6,7,8,9,10], 3)
     
if __name__ == "__main__":
    main()
```