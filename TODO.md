## Roadmap to Production: DSpace Integration

To transition the project from sandbox mode to a fully integrated production release, the required steps are divided between the backend and frontend as follows:

### Backend (Spring Boot)

- **Implement DSpace Integration Client:**

Develop a dedicated service (e.g., `DspaceIntegrationService`) to transmit validated metadata packages to a live DSpace server using its **REST API** or **SWORD protocol**.

- **Configure Secure Credentials:**

Set up required environment variables and properties in `application.yml` for production access, including the DSpace REST API endpoint URL, administrator credentials or bearer tokens, and the target collection UUID.

- **Link Local Records with DSpace Entities:**

Update the ingestion pipeline so that after successful local validation and database storage, a corresponding Item/Bitstream is created on the DSpace server, saving the returned `dspace\_item\_id` to your PostgreSQL database.

- **Handle Network Failures and Error States:**

Implement robust error handling for scenarios where the external DSpace server is unreachable or rejects the metadata payload, introducing corresponding status tracking (e.g., synchronization failure flags).

### Frontend (Angular)

- **Update User Interface Badges & Text:**

Remove the `🧪 Sandbox Mode` badge from the dashboard and restore the original production-ready description confirming direct integration into the institutional DSpace repository.

- **Handle Production Statuses:** Update UI components and status indicators if new error states (such as synchronization failures with the live DSpace server) are introduced by the backend API.
