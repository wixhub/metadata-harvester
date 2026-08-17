import { TestBed } from '@angular/core/testing';
import { SupportMailService } from './support-mail.service';

describe('SupportMailService', () => {
  let service: SupportMailService;

  beforeEach(() => {
    // Configure the testing module and inject the service before each test
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportMailService);
  });

  // Test to verify that the service is successfully created
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test to check if handleContact prevents default action, copies to clipboard, and sets window location
  it('should prevent default event, copy email to clipboard, and set window location to mailto', async () => {
    // Mock the Event object using Vitest spy
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as Event;

    // Mock navigator.clipboard.writeText safely for Vitest / JSDOM environment
    if (!navigator.clipboard) {
      // @ts-ignore
      navigator.clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    } else {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    }

    const originalLocation = window.location.href;

    // Call the asynchronous service method
    const success = await service.handleContact(mockEvent);

    // Assertions
    expect(success).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('rublin@gmx.de');
    expect(window.location.href).toBe('mailto:rublin@gmx.de');

    // Restore original location to avoid side effects
    window.location.href = originalLocation;
  });
});
