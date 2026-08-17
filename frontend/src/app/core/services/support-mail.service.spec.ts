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

  // Test to check if openMail prevents default action and sets window location correctly
  it('should prevent default event and set window location to mailto', () => {
    // Mock the Event object using global vi
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as Event;

    // Store original location to restore it later
    const originalLocation = window.location.href;

    // Call the service method
    service.openMail(mockEvent);

    // Assert that preventDefault was called to stop the default link behavior
    expect(mockEvent.preventDefault).toHaveBeenCalled();

    // Assert that the window location was correctly updated with the obfuscated email
    expect(window.location.href).toBe('mailto:rublin@gmx.de');

    // Restore original location to avoid side effects in other tests
    window.location.href = originalLocation;
  });
});
