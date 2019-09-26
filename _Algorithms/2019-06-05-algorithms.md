---
layout: post
title: 퀵 정렬(Quicksort)
subtitle: Hello Coding 그림으로 개념을 이해하는 알고리즘 정리
tags: [algorithms]
bigimg: /img/title_img/201906.jpg
---

## 분할 정복
* 문제 해결 방법 중에서 가장 유명한 재귀적 알고리즘
* 문제를 풀기 위한 방법론에 가깝다.

분할 정복 전략은 다음과 같이 동작한다.
1. 기본 단계를 찾는다.
2. 주어진 문제를 작게 줄여서 기본 단계가 되도록 만드는 법을 찾는다.

### 배열의 합계 구하기
#### 반복문으로 합계 구하기

```python
def sum(arr):
    total = 0
    for x in arr:
        total += x
    return total

def main():
    print(sum([1,2,3,4,5]))

if __name__ == "__main__":
    main()
```

#### 재귀 함수로 합계 구하기
1. 기본단계 : 원소의 개수가 0이면 합계는 0
2. 재귀단계 : 기본단계가 될 때까지 대상이 되는 배열의 크기를 줄여서 보낸다.

```python
def sum(arr):
    if len(arr) == 0:
        return 0
    return arr[0] + sum(arr[1:])

def main():
    print(sum([1,2,3,4,5]))

if __name__ == "__main__":
    main()
```

## 퀵 정렬
* 선택 정렬보다 훨씬 빠른 정렬 알고리즘
* 분할 정복 전략

1. 기본단계 : 원소의 개수가 0이거나 1
2. 기준원소 : 배열에서 원소하나를 고른다.
3. 분할 : 모든 원소를 기준원소보다 작은 숫자로 이루어진 배열, 기준원소보다 큰 숫자들로 이루어진 배열로 나눈다.
4. 두 개의 하위 배열에 대해 재귀적으로 퀵 정렬을 호출하고 그 결과를 합치면 전체 배열이 정렬된다.

```python
def quicksort(array):
    if len(array) < 2:
        return array # 기본단계
    else:
        pivot = array[0] # 기준원소
        # 분할
        less = [i for i in array[1:] if i <= pivot]
        greater = [i for i in array[1:] if i > pivot]
        return quicksort(less) + [pivot] + quicksort(greater)

def main():
    print(quicksort([3,5,2,1,4]))

if __name__ == "__main__":
    main()
```