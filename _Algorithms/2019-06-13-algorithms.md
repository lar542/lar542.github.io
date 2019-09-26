---
layout: post
title: 다익스트라 알고리즘(Dijkstra Algorithm)
subtitle: Hello Coding 그림으로 개념을 이해하는 알고리즘 정리
tags: [algorithms]
bigimg: /img/title_img/201906.jpg
---

* 너비 우선 탐색은 최단 경로를 찾아내며, 다익스트라 알고리즘은 최단 시간 경로를 구할 수 있다.
* 즉, 너비 우선 탐색은 가중치가 없는 균일 그래프에서 최단 경로를 계산하는 데 사용되며, 다익스트라 알고리즘은 가중 그래프에서 최단 거리를 계산하는 데 사용된다.
* 모든 가중치가 양수일 때만 정상적으로 동작한다.
* 만약 가중치가 음수이면 벨만-포드 알고리즘을 사용한다.  
다익스트라 알고리즘의 단계는 다음과 같다.
1. 가장 가격(가중치)이 싼 정점을 찾는다.
2. 이 정점의 이웃 정점에 대해 현재 가격보다 더 싼 경로가 존재하는지 확인한다. 만약 존재한다면 가격을 수정한다.
3. 모든 정점에 대해 이 일을 반복한다.
4. 최종 경로를 계산한다.

```python
# 각 정점의 이웃과 가격을 그래프로 구현
graph = {}
graph["start"] = {}
graph["start"]["a"] = 6
graph["start"]["b"] = 2

graph["a"] = {}
graph["a"]["fin"] = 1

graph["b"] = {}
graph["b"]["a"] = 3
graph["b"]["fin"] = 5

graph["fin"] = {}

'''
각 정점에 도달하는 가격(출발점에서 그 정점까지 걸리는 시간)을 저장
가격을 모르는 정점의 가격은 무한대로 둔다.
'''
infinity = float("inf")
costs = {}
costs["a"] = 6
costs["b"] = 2
costs["fin"] = infinity

# 각 정점까지 도달하는 데 거치는 부모를 저장
parents = {}
parents["a"] = "start"
parents["b"] = "start"
parents["fin"] = None

# 이미 처리한 정점을 저장
processed = []

def find_lowest_cost_node(costs):
    lowest_cost = float("inf")
    lowest_cost_node = None
    for node in costs:
        cost = costs[node]
        if cost < lowest_cost and node not in processed:
            lowest_cost = cost
            lowest_cost_node = node
    return lowest_cost_node

node = find_lowest_cost_node(costs) # 아직 처리하지 않은 가장 싼 정점
# 모든 정점을 처리할 때까지 반복
while node is not None:
    cost = costs[node]
    neighbors = graph[node]
    for n in neighbors.keys():
        new_cost = cost + neighbors[n]
        if costs[n] > new_cost:
            costs[n] = new_cost
            parents[n] = node
    processed.append(node)
    node = find_lowest_cost_node(costs)

print(costs)
```