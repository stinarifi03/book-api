import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { Users } from '../users/user.entity';

// A mock repository — we don't want to hit a real DB in unit tests
const mockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository, // inject mock instead of real TypeORM repo
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);

    // reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a book if it exists', async () => {
      const mockBook = { id: 1, title: 'Clean Code', author: 'Robert Martin' };
      mockRepository.findOneBy.mockResolvedValue(mockBook);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBook);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
  it('should create and return a book', async () => {
    const dto = { title: 'Clean Code', author: 'Robert Martin' };
    const owner: Users = { 
      id: 1, 
      email: 'test@test.com',
      password: 'hashed',
      role: Role.User,
      books: [],
    };
    const mockBook: Book = { 
      id: 1, 
      title: dto.title,
      author: dto.author,
      description: '',
      published: false,
      createdAt: new Date(),
      owner,
    };

    mockRepository.create.mockReturnValue(mockBook);
    mockRepository.save.mockResolvedValue(mockBook);

    const result = await service.create(dto, owner);

    expect(result).toEqual(mockBook);
    expect(mockRepository.create).toHaveBeenCalledWith({ ...dto, owner });
    expect(mockRepository.save).toHaveBeenCalledWith(mockBook);
  });
});

  describe('remove', () => {
    it('should allow owner to delete their book', async () => {
      const mockBook = { id: 1, title: 'Clean Code', owner: { id: 1 } };
      mockRepository.findOneBy.mockResolvedValue(mockBook);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(
        service.remove(1, 1, Role.User)
      ).resolves.not.toThrow();
    });

    it('should allow admin to delete any book', async () => {
      const mockBook = { id: 1, title: 'Clean Code', owner: { id: 2 } };
      mockRepository.findOneBy.mockResolvedValue(mockBook);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(
        service.remove(1, 1, Role.Admin) // user 1 deleting user 2's book as admin
      ).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if non-owner tries to delete', async () => {
      const mockBook = { id: 1, title: 'Clean Code', owner: { id: 2 } };
      mockRepository.findOneBy.mockResolvedValue(mockBook);

      await expect(
        service.remove(1, 1, Role.User) // user 1 trying to delete user 2's book
      ).rejects.toThrow(ForbiddenException);
    });
  });
});