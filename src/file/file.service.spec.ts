import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { promises as fs } from 'fs';
import * as path from 'path';

describe('FileService', () => {
  let service: FileService;
  const uploadPath = '/Users/inyongkim/Documents/Projects/localStorage';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
    service['uploadPath'] = uploadPath;  // 경로 설정

    // 업로드 디렉토리가 존재하지 않을 경우 생성
    await fs.mkdir(uploadPath, { recursive: true });
  });

//   afterEach(async () => {
//     // 테스트 후 생성된 파일 삭제
//     try {
//       const files = await fs.readdir(uploadPath);
//       for (const file of files) {
//         await fs.unlink(path.join(uploadPath, file));
//       }
//     } catch (err) {
//       // 파일 삭제 중 오류가 발생하면 무시
//       console.error('Failed to clean up files:', err);
//     }
//   });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      // Given: 실제 파일 데이터를 준비
      const mockFile: Express.Multer.File = {
        originalname: 'test.txt',
        buffer: Buffer.from('This is a test file'),
        mimetype: 'text/plain',
        size: 1024,
        encoding: '7bit',
        fieldname: 'file',
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };
      const mockFilePath = path.join(uploadPath, mockFile.originalname);

      // When: 파일 업로드를 시도
      const result = await service.uploadFile(mockFile);

      // Then: 파일 업로드가 성공했는지 확인
      expect(result).toEqual({
        message: 'File uploaded successfully',
        filePath: mockFilePath,
      });

      // 파일이 실제로 생성되었는지 확인
      const fileExists = await fs.stat(mockFilePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('should throw an error when file upload fails', async () => {
      // Given: Mock 파일과 실패 시나리오 준비
      const mockFile: Express.Multer.File = {
        originalname: 'test.txt',
        buffer: Buffer.from('This is a test file'),
        mimetype: 'text/plain',
        size: 1024,
        encoding: '7bit',
        fieldname: 'file',
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };
      jest.spyOn(fs, 'writeFile').mockRejectedValue(new Error('Failed to upload'));

      // When: 파일 업로드가 실패할 때
      // Then: 오류가 발생하는지 확인
      await expect(service.uploadFile(mockFile)).rejects.toThrow('Failed to upload file');
    });
  });
});
