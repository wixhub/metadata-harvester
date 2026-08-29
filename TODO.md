## Roadmap to Production: DSpace Integration

To transition the project from sandbox mode to a fully integrated production release, the required steps are divided between the backend and frontend as follows:

### Backend (Spring Boot)

- **Validate Profile Activation:** Ensure the dspace-prod profile is correctly configured in your deployment environment via `SPRING_PROFILES_ACTIVE=dspace-prod` to activate **RealDSpaceService** over the mock implementation.

- **Configure Production Endpoints:** Set up required environment variables and properties in `application.yml` for live access, including the **DSpace REST API** endpoint URL, administrator credentials or bearer tokens and the target collection UUID.

- **Verify Persistence & Linking:** Confirm that the ingestion pipeline successfully saves the returned dspace_item_id to your (Neon PostgreSQL) database after a successful live item and bitstream creation.

- **Monitor Error Handling:** Test resilience strategies for network failures, unreachable DSpace servers, or rejected metadata payloads, ensuring synchronization failure flags are accurately updated in the database.

### Frontend (Angular)

- **Update User Interface Badges & Text:**

Remove the `🧪 Sandbox Mode` badge from the dashboard and restore the original production-ready description confirming direct integration into the institutional DSpace repository.

- **Handle Production Statuses:** Update UI components and status indicators if new error states (such as synchronization failures with the live DSpace server) are introduced by the backend API.
