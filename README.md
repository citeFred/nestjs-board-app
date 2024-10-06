<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS-Project-BoardApp
NestJS(Typescript) + TypeORM 게시판 웹 서비스


## 🖥️ 프로젝트 소개 
- 기본적인 게시판 NestJS 백엔드 서버를 구현해보는 프로젝트 입니다.
- 개발 블로그를 통해 개념/과정을 상세히 확인 할 수 있습니다.
https://www.citefred.com/tags/nestjs
<br>

- `root/.env` 파일 작성이 필요합니다. 현재 AWS 연동 과정 진행으로 `RDS Bucket주소`, `AccessKey`, `SecretKey` 필요한 상태
- 발급 과정은 블로그의 정리 내용을 참고하시길 바랍니다. https://www.citefred.com/nestjs/21
```.env
# DATABASE 설정 정보
DB_HOST=본인의RDS주소
DB_PORT=3306
DB_USERNAME=본인의RDS계정명
DB_PASSWORD=본인의RDS계정비밀번호
DB_NAME=boardapp

# JWT Secret Key
JWT_SECRET=본인의JWT토큰암호화키
JWT_EXPIRATION=36000

# 서버
SERVER_PORT=3000
SERVER_HOST=localhost

# 로깅
LOG_LEVEL=info

# Kakao Login API
KAKAO_CLIENT_ID=본인의카카오클라이언트ID
KAKAO_CALLBACK_URL=본인의카카오콜백URL

# AWS Keys
AWS_ACCESS_KEY_ID=본인의AWS_AccessKey
AWS_SECRET_ACCESS_KEY=본인의AWS_SecretKey

# 외부 API관련 Key 등 필요 시 추가
```

## 🗄️ 서버 Github
- Backend Server (현재 페이지)
https://github.com/citeFred/nestjs-board-app/
- Frontend Server
https://github.com/citeFred/nest-js-board-frontend

## 🕰️ 개발 기간
* 24.8 - 현재

### 🧑‍🤝‍🧑 맴버구성 
 - 김인용 - 백엔드 : JWT 인증/인가, 게시판 기본 CRUD, 기능 추가 예정

### ⚙️ 개발 환경 
- **MainLanguage** : `TypeScript`
- **IDE** : `VSCode`
- **Framework** : `NestJS`, `TypeORM`
- **Database** : `MySQL@8.0`
- **Server** : `Express`

## 📌 주요 기능
#### 로그인
- JWT + Cookie 로그인
- 카카오 API 로그인

#### 회원가입
- 다음 주소 API 연동
- Bcrypt Password 해싱

#### 게시글
- 글 작성, 읽기, 수정, 삭제(CRUD)
- 게시판 카테고리 추가 기능(예정)
- 페이징처리 및 무한스크롤 기능(예정)

#### 댓글, 대댓글
- 댓글 작성, 읽기, 수정, 삭제(CRUD)(예정)

<br>

## 📌 About NestJS

### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

### Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

### License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).