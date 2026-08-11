To connect to a real **DSpace REST API** in a production environment:

- **Configure Environment Variables**: Set the production DSpace API URL and access token in your environment variables or secure vault (`DSPACE_API_URL` and `DSPACE_API_TOKEN`) to override the default properties in `application.yml`.

- **Switch the Implementation in `DSpaceService.java`**: Comment out the mock implementation block at the top of the file and uncomment the real `WebClient`-based implementation block at the bottom.

- **Update DSpace Collection Mapping**: Ensure that `Dataset` entity provides a valid target collection ID (`dataset.getDspaceCollectionId()`) so the REST client can target the correct repository collection.

- **Implement Resiliency Patterns**: Wrap `WebClient` requests with resilience libraries like Resilience4j to handle network timeouts, retries, and circuit breaking if the DSpace server experiences downtime.

- **Configure Security & SSL/TLS**: Ensure proper HTTPS communication, handle token expiration/refresh cycles if required by DSpace instance, and configure valid SSL/TLS certificates.

- **Add Integration Tests**: Write automated integration tests using a tool like WireMock to simulate DSpace API responses and verify the integration pipeline before deploying to production.
