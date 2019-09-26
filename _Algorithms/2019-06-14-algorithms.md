---
layout: post
title: 탐욕 알고리즘(Greedy Algorithms)
subtitle: Hello Coding 그림으로 개념을 이해하는 알고리즘 정리
tags: [algorithms]
bigimg: /img/title_img/201906.jpg
---

* 구현이 간단하면서도 계산 속도가 빠르며 정답에 상당히 가까운 답을 주는 근사 알고리즘
* 너비 우선 탐색과 다익스트라 알고리즘도 탐욕 알고리즘에 해당된다.

## 집합 커버링 문제
미국 50개의 주에 있는 모든 사람에게 최소 한 번은 라디오 쇼를 들려줘야 한다. 하나의 방송국을 통해 청취할 수 있는 지역은 한정되어 있기 때문에 전국에 흩어져 있는 몇 개의 라디오 방송국들을 방문해서 라디오 쇼를 진행해야 한다. 최대한 적은 수의 방송국을 돌아야하려면 어느 방송국을 방문해야 할까?
* 만약 정확한 알고리즘으로 돌리면 가능한 모든 부분 집합을 계산해야 하는데, 방문해야하는 방송국의 수가 클 수록 전체 실행시간이 급격히 증가하게 되므로 탐욕 알고리즘을 사용한다.
    * NP-완전문제 : 모든 가능한 경우를 다 따져서 최단/최소를 구해야하는 문제. NP-완전문제가 주어지면 근사 알고리즘을 쓰는 것이 최선이다.
1. 아직 방송하지 않은 지역 중 가장 많은 지역에 방송할 수 있는 방송국을 고른다. 이미 방송되고 있는 지역이 일부 포함되어 있어도 상관없다.
2. 모든 주에 방송이 될 때까지 선택을 반복한다.

```python
# 방송하고자 하는 주의 목록
states_needed = set(["mt", "wa", "or", "id", "nv", "ut", "ca", "az"])

'''
방송국의 목록
Key : 방송국 이름, Value : 방송국이 방송하는 주의 목록
'''
stations = {}
stations["kone"] = set(["id", "nv", "ut"])
stations["ktwo"] = set(["wa", "id", "mt"])
stations["kthree"] = set(["or", "nv", "ca"])
stations["kfour"] = set(["nv", "ut"])
stations["kfive"] = set(["ca", "az"])

# 방문한 방송국의 목록
final_stations = set()

while states_needed:
    best_station = None # 가장 많은 주를 방송하고 있는 방송국
    states_covered = set() # 해당 방송국이 방송하는 주의 집합
    for station, states_for_station in stations.items():
        covered = states_needed & states_for_station # 교집합
        if len(covered) > len(states_covered):
            best_station = station
            states_covered = covered
    final_stations.add(best_station)
    states_needed -= states_covered

print(final_stations)
```
