import { SupportBtn } from './support-btn';
import { SupportMailService } from '../../services/support-mail.service';
import { Injector, runInInjectionContext } from '@angular/core';

describe('SupportBtn', () => {
  let component: SupportBtn;
  let mockMailService: { handleContact: ReturnType<typeof vi.fn> };
  let injector: Injector;

  beforeEach(() => {
    vi.useFakeTimers();

    mockMailService = {
      handleContact: vi.fn(),
    };

    injector = Injector.create({
      providers: [{ provide: SupportMailService, useValue: mockMailService }],
    });

    component = runInInjectionContext(injector, () => new SupportBtn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with copied signal as false', () => {
    expect(component.copied()).toBe(false);
  });

  it('should set copied to true and reset after 3 seconds when handleContact succeeds', async () => {
    mockMailService.handleContact.mockResolvedValue(true);
    const mockEvent = new Event('click');

    await component.onContactClick(mockEvent);

    expect(mockMailService.handleContact).toHaveBeenCalledWith(mockEvent);
    expect(component.copied()).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(component.copied()).toBe(false);
  });

  it('should not change copied state when handleContact fails', async () => {
    mockMailService.handleContact.mockResolvedValue(false);
    const mockEvent = new Event('click');

    await component.onContactClick(mockEvent);

    expect(mockMailService.handleContact).toHaveBeenCalledWith(mockEvent);
    expect(component.copied()).toBe(false);
  });
});
