---
layout: post
title: 선택 정렬(Selection Sort)
subtitle: Hello Coding 그림으로 개념을 이해하는 알고리즘 정리
tags: [algorithms]
bigimg: /img/title_img/201906.jpg
---

* O(n) 실행시간이 걸리는 연산을 n번 수행하는 것
* 주어진 리스트 중에 최소값을 찾아 맨 앞에 위치한 값과 교체하고 맨 앞의 값을 제외한 나머지를 같은 방법으로 교체하여 최종적으로 리스트를 정렬시킨다
* 메모리가 제한적인 경우에 사용시 성능 상의 이점이 있다  
![선택 정렬 애니메이션](https://upload.wikimedia.org/wikipedia/commons/9/94/Selection-Sort-Animation.gif)

```python
# 배열에서 가장 작은 원소 값의 인덱스를 찾는다
def findSmallest(arr):
     smallest = arr[0] # 가장 작은 값
     smallest_index = 0 # 가장 작은 값의 인덱스
 
     for i in range(1, len(arr)):
       if arr[i] < smallest:
         smallest = arr[i]
         smallest_index = i
 
     return smallest_index
 
# 배열을 정렬한다
def selectionSort(arr):
    newArr = []
    # 가장 작은 원소 값을 찾아 새 배열에 추가하고 기존 배열의 원소 값은 삭제
    for i in range(len(arr)):
        smallest = findSmallest(arr)
        newArr.append(arr.pop(smallest))
 
    return newArr
 
def main():
    print("정렬결과 :", selectionSort([5, 3, 6, 2, 10]))
 
if __name__ == "__main__":
    main()
```