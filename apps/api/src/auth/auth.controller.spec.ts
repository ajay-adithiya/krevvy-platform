import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    changeEmail: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should extract req.user.id for changeEmail', () => {
    const req = { user: { id: 'test-id' } };
    controller.changeEmail(req, { newEmail: 'x', currentPassword: 'y' });
    expect(mockAuthService.changeEmail).toHaveBeenCalledWith('test-id', { newEmail: 'x', currentPassword: 'y' });
  });

  it('should extract req.user.id for changePassword', () => {
    const req = { user: { id: 'test-id' } };
    controller.changePassword(req, { newPassword: 'x', currentPassword: 'y' });
    expect(mockAuthService.changePassword).toHaveBeenCalledWith('test-id', { newPassword: 'x', currentPassword: 'y' });
  });
});
