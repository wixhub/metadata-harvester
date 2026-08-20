## Future Improvements

- **Implement Resiliency Patterns**: Wrap `WebClient` requests with resilience libraries like Resilience4j to handle network timeouts, retries and circuit breaking if the DSpace server experiences downtime.

- **Configure Security & SSL/TLS**: Ensure proper HTTPS communication, handle token expiration/refresh cycles if required by DSpace instance and configure valid SSL/TLS certificates.

- **Add Integration Tests**: Write automated integration tests using a tool like WireMock to simulate DSpace API responses and verify the integration pipeline before deploying to production.
