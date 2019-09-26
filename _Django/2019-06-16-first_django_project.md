---
layout: post
title: Django - 로컬 개발환경 설치
subtitle: Python, PyCharm, Django 설치 후 웹 프로젝트와 웹 앱 생성
tags: [django]
bigimg: /img/title_img/201906.jpg
---

[파이썬으로 장고(Django) 공략하기: 입문](https://www.inflearn.com/course/django-course#) 강의를 정리한 내용입니다.

## 1. Python 3.6 버전 설치
* [Download Python](https://www.python.org/downloads/release/python-366/)
* 아래의 Files에서 Windows x86-64 executable installer 를 다운로드(32bit라면 Windows x86 executable installer)
* Add Python 3.6 to PATH 를 체크하고 설치
* 콘솔에서 설치 확인

```
python --version
```
<br>

## 2. PyCharm 설치
* [Download PyCharm](https://www.jetbrains.com/pycharm/download)
* Community(무료) 버전으로 설치

<br>

## 3. Django 설치
### 3.1. Virtualenv 설치
* Virtualenv는 서로 다른 개발 환경마다 프로그램들의 버전이 충돌나는 것을 방지하기 위한 파이썬 기반 모듈
* 파이썬 설치 시 같이 설치가 되나 안 된 경우 콘솔에서 pip을 이용해 설치해야 한다.
    * pip: 파이썬 모듈을 명령어로 다운로드해주는 프로그램

```
pip install virtualenv
```
* 설치 확인

```
virtualenv
```
### 3.2. 생성한 프로젝트 작업 폴더로 이동 후 Virtualenv 가상환경 설치 및 진입, 장고 설치
* 가상환경의 이름은 venv라고 지정하고 설치한다.
    * Windows
```
virtualenv venv
```
    * Mac
```
virtualenv -p python3 venv
```
* 현재 프로젝트 작업 폴더에 설치된 가상환경으로 진입
    * Windows
```
venv\Scripts\activate
```
    * Mac
```
source venv/bin/activate
```
* 가상환경에 진입한 상태

```
(venv) E:\repositories\django\first-django>
```
* 가상환경 안에 장고 설치

```
pip install django
```
<br>

## 4. 장고 웹 프로젝트 생성
* 장고 명령어 조회

```
django-admin
```
* firstdjango라는 이름의 프로젝트 폴더를 현재 경로에 생성

```
django-admin startproject firstdjango .
```
* 프로젝트 실행

```
python manage.py runserver
```

<br>

## 5. 장고 웹 앱 생성
* PyCharm 실행 후 프로젝트 폴더로 Open
* 하단의 Terminal 탭을 열면 virtualenv가 진입된 상태인 걸 확인할 수 있다.
* 프로젝트를 생성할 때는 앞의 단계를 거치고 그 이후에 Pycharm으로 프로젝트 폴더를 Open하여 작업하면 된다.
* 장고 앱 : 프로젝트를 구성하는 모듈들. 장고 프로젝트는 여러 개의 장고 앱을 가질 수 있다.
* first라는 이름의 웹 앱을 생성한다.

```
python manage.py startapp first
```
* 장고 프로젝트의 구조
    * manage.py : 장고 앱을 관리하기 위한 명령어를 내장하고 있는 스크립트 파일
    * firstdjango(프로젝트 폴더)
        * settings.py : 프로젝트 전반의 설정 정보
        * urls.py : 프로젝트를 실행시킬 때 어떤 웹 앱의 페이지를 어떤 url에 연결시킬 지를 설정하는 파일
        * wsgi.py : 웹 사이트 실행 프로세스와 관련하여 사용되는 파일
    * first(웹 앱 폴더)
        * admin.py : 장고 관리자 웹을 구성하기 위해 필요한 파일
        * apps.py : 장고 웹 앱에 대한 설정 파일
        * models.py : 데이터베이스에 정의하기 위한 모델들에 대해 정의하는 파일
        * views.py : 웹 페이지나 웹 요청 등을 처리하는 코드를 작성하는 파일