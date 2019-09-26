---
layout: post
title: 너비 우선 탐색(BFS, Breadth First Search)
subtitle: Hello Coding 그림으로 개념을 이해하는 알고리즘 정리
tags: [algorithms]
bigimg: /img/title_img/201906.jpg
---

* 다익스트라 알고리즘과 달리 가중치가 없는 균일 그래프에서 최단 경로를 계산하는 데 사용된다.
* A에서 B로 가는 경로가 있는지 알려준다.
* 만약 경로가 존재한다면 최단 경로도 찾아준다.
* X까지의 최단 경로를 찾는 문제가 있다면
    1. 문제를 그래프로 모형화한다.
    2. 너비 우선 탐색으로 문제를 푼다.

## 망고 판매상 찾기
친구 중에서 망고 판매상을 찾는다. 친구 중에 망고 판매상이 없다면 그 친구의 친구를 찾아본다. 또 그 중에서 없다면 친구의 친구의 친구 중에서 찾아본다. 망고 판매상에 도달할 때까지 전체 네트워크를 탐색한다.  
이를 너비 우선 탐색 알고리즘으로 나타낼 수 있다.
1. 네트워크에 망고 판매상이 있는가? → 망고 판매상을 찾기 위한 목록에 친구를 추가한다.
    * 해시 테이블은 순서를 가지지 않기 때문에 어떤 순서로 목록에 추가해도 상관없다.
2. 누가 가장 가까운 망고 판매상인가? → 목록에 추가한 순서대로 탐색해야 하므로 **큐**를 사용한다.
    * 큐 : 선입선출 자료구조(FIFO, First In First Out)
    * 스택 : 후입선출 자료구조(LIFO, Last In First Out)

```python
from collections import deque

# 이름이 m으로 끝나면 망고 판매상으로 판단한다.
def person_is_seller(name):
    return name[-1] == 'm'

# 그래프로 모형화 : 관계를 표시하는 자료구조인 해시 테이블 사용
graph = {}
graph["you"] = ["alice", "bob", "claire"]
graph["bob"] = ["anuj", "peggy"]
graph["alice"] = ["peggy"]
graph["claire"] = ["thom", "jonny"]
graph["anuj"] = []
graph["peggy"] = []
graph["thom"] = []
graph["jonny"] = []

def search(name):
    search_queue = deque() # 탐색을 위한 큐 생성
    search_queue += graph[name] # 탐색할 사람을 큐에 추가
    searched = [] # 이미 확인한 사람의 명단

    # 큐가 비어있지 않는 한 계속 반복
    while search_queue:
        person = search_queue.popleft() # 큐의 첫번째 요소를 꺼냄
        if not person in searched:
            if person_is_seller(person):
                print(person + "는 망고 판매상이다!")
                return True
            else:
                search_queue += graph[person] # 망고 판매상이 아닐 때 그의 이웃을 다시 큐에 추가
                searched.append(person)
    return False

search("you")
```