import { TestBed } from '@angular/core/testing';
import { SupportMailService } from './support-mail.service';

describe('SupportMailService', () => {
  let service: SupportMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportMailService],
    });

    service = TestBed.inject(SupportMailService);

    // Mock clipboard API since it is not natively implemented in JSDOM / Node test environment
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should assemble and return the correct email address', () => {
    const email = service.getEmail();
    expect(email).toBe('rublin@gmx.de');
  });

  it('should copy email to clipboard and set window location on handleContact', async () => {
    const mockEvent = new Event('click');
    vi.spyOn(mockEvent, 'preventDefault');

    // Safely mock window.location.href assignment using Object.defineProperty
    let assignedHref = '';
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        set href(val: string) {
          assignedHref = val;
        },
        get href() {
          return assignedHref;
        },
      },
    });

    const result = await service.handleContact(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('rublin@gmx.de');
    expect(assignedHref).toBe('mailto:rublin@gmx.de');
    expect(result).toBe(true);
  });

  it('should handle clipboard write failures gracefully', async () => {
    const mockEvent = new Event('click');

    // Simulate a rejected clipboard write promise
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Clipboard error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await service.handleContact(mockEvent);

    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toBe(false);

    consoleSpy.mockRestore();
  });
});
