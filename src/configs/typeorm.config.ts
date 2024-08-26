import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql', // 사용할 데이터베이스 유형 (MySQL, PostgreSQL, SQLite 등)
    host: 'localhost', // 데이터베이스 호스트
    port: 3306, // 데이터베이스 포트
    username: 'inyongkim', // 데이터베이스 사용자 이름
    password: '1234', // 데이터베이스 비밀번호
    database: 'board-app', // 사용할 데이터베이스 이름
    entities: [__dirname + '/../**/*.entity.{js,ts}'], // 엔티티 파일의 위치
    synchronize: true, // 애플리케이션 실행 시 스키마를 동기화할지 여부 (개발 중에만 true로 설정)
    logging: true, // SQL 쿼리 로그를 출력할지 여부
};